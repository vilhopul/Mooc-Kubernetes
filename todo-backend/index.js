const express = require('express')
const { Pool } = require('pg')
const app = express()
const port = process.env.PORT || 3000

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
})

async function initDb() {
  const client = await pool.connect()
  try {
    await client.query('CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, todo VARCHAR(140))')
    console.log('Database initialized')
  } catch (err) {
    console.error('rrror initializing db', err)
  } finally {
    client.release()
  }
}

initDb()

app.use(express.json())

app.get('/todos', async (req, res) => {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT * FROM todos')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('db error')
  } finally {
    client.release()
  }
})

app.post('/todos', async (req, res) => {
  const todo = req.body
  console.log('adding todo:', todo)
  
  if (!todo.todo || todo.todo.length > 140) {
     console.log('oh no, todo is too long!:', todo)
     return res.status(400).send('todo error')
  }

  const client = await pool.connect()
  try {
    const result = await client.query('INSERT INTO todos (todo) VALUES ($1) RETURNING *', [todo.todo])
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('db error')
  } finally {
    client.release()
  }
})

app.listen(port, () => {
  console.log(`Todo backend listening on port ${port}`)
})

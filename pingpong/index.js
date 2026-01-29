const express = require('express')
const { Pool } = require('pg')
const app = express()
const port = process.env.PORT || 3000

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

async function initDb() {
  const client = await pool.connect()
  try {
    await client.query('CREATE TABLE IF NOT EXISTS pings (id SERIAL PRIMARY KEY, counter INTEGER DEFAULT 0)')
    const res = await client.query('SELECT * FROM pings WHERE id = 1')
    if (res.rowCount === 0) {
      await client.query('INSERT INTO pings (id, counter) VALUES (1, 0)')
    }
  } catch (err) {
    console.error('error initializing db', err)
  } finally {
    client.release()
  }
}

initDb()

app.get('/', async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query('UPDATE pings SET counter = counter + 1 WHERE id = 1')
    const result = await client.query('SELECT counter FROM pings WHERE id = 1')
    const counter = result.rows[0].counter
    res.send(`pong ${counter}`)
  } catch (err) {
    console.error(err)
    res.status(500).send('Database error')
  } finally {
    client.release()
  }
})

app.get('/pings', async (req, res) => {
  const client = await pool.connect()
  try {
     const result = await client.query('SELECT counter FROM pings WHERE id = 1')
     const counter = result.rows.length > 0 ? result.rows[0].counter : 0
     res.send(`pongs ${counter}`)
  } catch (err) {
    console.error(err)
  } finally {
    client.release()
  }
})

app.get('/healthz', async (req, res) => {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    res.status(200).send('OK')
  } catch (err) {
    console.error('Health check failed:', err)
    res.status(500).send('Database connection failed')
  }
})

app.listen(port, () => {
  console.log(`Pingpong app listening on port ${port}`)
})
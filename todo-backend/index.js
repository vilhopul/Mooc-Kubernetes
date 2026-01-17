const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

let todos = []

app.get('/todos', (req, res) => {
  res.json(todos)
})

app.post('/todos', (req, res) => {
  const todo = req.body
  console.log('Adding todo:', todo)
  todos.push(todo)
  res.json(todo)
})

app.listen(port, () => {
  console.log(`Todo backend listening on port ${port}`)
})

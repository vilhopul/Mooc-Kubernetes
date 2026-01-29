import express from 'express'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT
const BACKEND_PORT = process.env.backend_port
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const imagePath = path.join(directory, 'image.jpg')
const todoPath = path.join(directory, 'todos.txt')

const downloadImage = async () => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
  const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
  response.data.pipe(fs.createWriteStream(imagePath))
}

const checkImage = async () => {
  if (!fs.existsSync(imagePath)) {
    console.log('Image not found, downloading...')
    await downloadImage()
    return
  }

  const stats = fs.statSync(imagePath)
  const now = new Date().getTime()
  const mtime = new Date(stats.mtime).getTime()
  const diff = now - mtime

  if (diff > 60 * 1000 * 10) { 
    downloadImage()
  }
}

app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  await checkImage()

  let todos = []
  try {
    const response = await axios.get(`http://todo-backend-svc:${BACKEND_PORT}/todos`)
    todos = response.data
  } catch (error) {
    console.error('error fetching todos:', error.message)
  }

  const todoListHtml = todos.map(todo => `<li>${todo.todo}</li>`).join('')

  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <h1>this is running inside kube!!</h1>
        <img src="/image.jpg" style="max-width: 50%;" />
        <div style="margin-top: 10px;">
          <form action="/todos" method="post">
            <input type="text" name="todo" maxlength="140" placeholder="add something to todo " />
            <input type="submit" value="Create todo" />
          </form>
        </div>
        <ul>
          ${todoListHtml}
        </ul>
      </body>
    </html>
  `)
})

app.post('/todos', async (req, res) => {
  const newTodo = {
    todo: req.body.todo
  }
  try {
    await axios.post(`http://todo-backend-svc:${BACKEND_PORT}/todos`, newTodo)
  } catch (error) {
    console.error('error creating todo:', error.message)
  }
  res.redirect('/')
})

app.get('/image.jpg', (req, res) => {
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath)
  } else {
    res.status(404).send('Image not found')
  }
})

app.get('/healthz', async (req, res) => {
  try {
    const response = await axios.get(`http://todo-backend-svc:${BACKEND_PORT}/healthz`, { timeout: 2000 })
    if (response.status === 200) {
      res.status(200).send('OK')
    } else {
      res.status(503).send('Backend not ready')
    }
  } catch (err) {
    console.error('Health check failed:', err.message)
    res.status(503).send('Backend connection failed')
  }
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

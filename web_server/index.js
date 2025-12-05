import express from 'express'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT
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

app.get('/', async (req, res) => {
  await checkImage()

  let todos = ['eat', 'sleep', 'code kubernetes']
  if (fs.existsSync(todoPath)) {
    const content = fs.readFileSync(todoPath, 'utf-8')
    todos = content.split('\n').filter(todo => todo.trim() !== '')
  }

  const todoListHtml = todos.map(todo => `<li>${todo}</li>`).join('')

  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <h1>this is running inside kube!</h1>
        <img src="/image.jpg" style="max-width: 50%;" />
        <div style="margin-top: 10px;">
          <input type="text" maxlength="141" placeholder="add something to todo " />
          <input type="button" value="Create todo" />
        </div>
        <ul>
          ${todoListHtml}
        </ul>
      </body>
    </html>
  `)
})

app.get('/image.jpg', (req, res) => {
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath)
  } else {
    res.status(404).send('Image not found')
  }
})

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`)
})

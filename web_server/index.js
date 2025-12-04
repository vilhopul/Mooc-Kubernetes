import express from 'express'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const app = express()
const PORT = process.env.PORT
const directory = path.join('/', 'usr', 'src', 'app', 'files')
const imagePath = path.join(directory, 'image.jpg')

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
  res.send(`
    <!DOCTYPE html>
    <html>
      <body>
        <h1>this is running inside kube!</h1>
        <img src="/image.jpg" style="max-width: 100%;" />
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

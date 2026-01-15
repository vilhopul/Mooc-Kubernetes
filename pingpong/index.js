const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pingpong.txt')

let counter = 0
// if (fs.existsSync(filePath)) {
//   counter = parseInt(fs.readFileSync(filePath, 'utf8')) || 0
// }

app.get('/pingpong', (req, res) => {
  res.send(`pong ${counter}`)
  counter++
  // if (!fs.existsSync(directory)) {
  //   fs.mkdirSync(directory, { recursive: true })
  // }
  // fs.writeFileSync(filePath, counter.toString())
})

app.get('/pings', (req, res) => {
  res.send(`pongs ${counter}`)
})


app.listen(port, () => {
  console.log(`Pingpong app listening on port ${port}`)
})
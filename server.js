const express = require('express')
const dotenv = require('dotenv')

dotenv.config({
  path: './config/config.env',
})

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Hello World' })
})

app.get('/api/v1/course', (req, res) => {
  res.status(200).json({ success: true, msg: '获取所有课程' })
})

app.get('/api/v1/course/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `获取第${req.params.id}节课程` })
})

app.post('/api/v1/course', (req, res) => {
  res.status(200).json({ success: true, msg: `创建课程` })
})

app.put('/api/v1/course/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `更新第${req.params.id}节课程` })
})

app.delete('/api/v1/course/:id', (req, res) => {
  res.status(200).json({ success: true, msg: `删除第${req.params.id}节课程` })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`)
})

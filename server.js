const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

// 路由
const course = require('./routes/course')

dotenv.config({
  path: './config/config.env',
})

connectDB()

const app = express()

// 配置 body 解析
app.use(express.json())

app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Hello World' })
})

// 挂载路由节点
app.use('/api/v1/course', course)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.magenta
      .bold
  )
})

process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`)
  server.close(() => {
    process.exit(1)
  })
})

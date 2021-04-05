const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')

// 路由
const camps = require('./routes/camps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')

dotenv.config({
  path: './config/config.env',
})

connectDB()

const app = express()

// 配置 body 解析
app.use(express.json())

app.use(morgan('dev'))

app.use(cookieParser())

app.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Hello World' })
})

// 挂载路由节点
app.use('/api/v1/camps', camps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)

// 使用错误处理中间件，必须在挂载路由节点之后
app.use(errorHandler)

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

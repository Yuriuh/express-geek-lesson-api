const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const course = require('./routes/course')

dotenv.config({
  path: './config/config.env',
})

const app = express()

app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Hello World' })
})

// 挂宅路由节点
app.use('/api/v1/course', course)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.magenta
      .bold
  )
})

const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({
  path: './config/config.env',
})

const Camp = require('./models/Camp')
const Course = require('./models/Course')
const User = require('./models/User')

// 连接数据库
mongoose.connect(process.env.LOC_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

// 读取本地 json 数据
const camps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/camps.json`, 'utf-8')
)

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
)

const insertData = async () => {
  try {
    await Camp.create(camps)
    await Course.create(courses)
    await User.create(users)
    console.log('数据存储成功'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

// 删除数据库中的数据
const deleteData = async () => {
  try {
    await Camp.deleteMany()
    await Course.deleteMany()
    await User.deleteMany()
    console.log('数据删除成功'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

const mode = process.argv[2]
if (mode === '-i') {
  insertData()
} else if (mode === '-d') {
  deleteData()
}

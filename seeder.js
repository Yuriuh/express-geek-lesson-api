const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({
  path: './config/config.env',
})

const Course = require('./models/Course')

// 连接数据库
mongoose.connect(process.env.LOC_MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
)

const insertData = async () => {
  try {
    await Course.create(courses)
    console.log('数据存储成功'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(error)
  }
}

// 删除数据库中的数据
const deleteData = async () => {
  try {
    await Course.deleteMany()
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

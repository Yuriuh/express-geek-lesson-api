const express = require('express')
const router = express.Router()

// 引入控制器
const {
  getCourseAll,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/course')

router.route('/').get(getCourseAll).post(createCourse)

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router

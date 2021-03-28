const express = require('express')
const router = express.Router({ mergeParams: true })

// 引入控制器
const {
  getCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses')

router.route('/').get(getCourses).post(createCourse)

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router

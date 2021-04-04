const express = require('express')
const router = express.Router({ mergeParams: true })

// 引入控制器
const {
  getCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses')

const { protect, authorize } = require('../middleware/auth')

const advancedResults = require('../middleware/advancedResults')
const Course = require('../models/Course')

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'camp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, authorize('admin', 'user'), addCourse)

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'user'), updateCourse)
  .delete(protect, authorize('admin', 'user'), deleteCourse)

module.exports = router

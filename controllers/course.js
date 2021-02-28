const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   获取所有课程
 * @route  GET /api/v1/course
 * @access 公开的
 */
exports.getCourseAll = asnycHandler(async (req, res, next) => {
  const courses = await Course.find()
  const count = courses.length
  res.status(200).json({ success: true, count, data: courses })
})

/**
 * @desc   创建课程
 * @route  POST /api/v1/course
 * @access 公开的
 */
exports.createCourse = asnycHandler(async (req, res, next) => {
  const course = await Course.create(req.body)
  res.status(200).json({ success: true, data: course })
})

/**
 * @desc   查看某个课程
 * @route  GET /api/v1/course/:id
 * @access 公开的
 */
exports.getCourse = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const course = await Course.findById(id)
  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!course) {
    return next(error)
  }

  res.status(200).json({ success: true, data: course })
})

/**
 * @desc   更新课程
 * @route  PUT /api/v1/course/:id
 * @access 公开的
 */
exports.updateCourse = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const body = req.body
  const course = await Course.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })

  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!course) {
    return next(error)
  }

  res.status(200).json({ success: true, data: course })
})

/**
 * @desc   课程课程
 * @route  DELETE /api/v1/course/:id
 * @access 公开的
 */
exports.deleteCourse = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const course = await Course.findByIdAndDelete(id)
  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!course) {
    return next(error)
  }

  res.status(200).json({ success: true, data: {} })
})

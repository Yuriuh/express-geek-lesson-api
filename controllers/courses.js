const Course = require('../models/Course')
const Camp = require('../models/Camp')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   获取所有课程
 * @route  GET /api/v1/courses
 * @route  GET /api/v1/camps/:campId/courses
 * @access public
 */
exports.getCourses = asnycHandler(async (req, res, next) => {
  const {
    params: { campId },
  } = req

  if (campId) {
    // 这个地方如何支持高级查询
    const courses = await Course.find({ camp: campId })
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

/**
 * @desc   创建课程
 * @route  POST /api/v1/camps/:campId/courses
 * @access public
 */
exports.addCourse = asnycHandler(async (req, res, next) => {
  const {
    params: { campId },
  } = req
  const camp = await Camp.findById(campId)

  const error = new ErrorResponse(
    `Resource not found with the value of ${campId}`,
    404
  )

  if (!camp) {
    return next(error)
  }

  const course = await Course.create(req.body)
  res.status(200).json({ success: true, data: course })
})

/**
 * @desc   查看某个课程
 * @route  GET /api/v1/courses/:id
 * @access public
 */
exports.getCourse = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const course = await Course.findById(id).populate({
    path: 'camp',
    select: 'name description',
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
 * @desc   更新课程
 * @route  PUT /api/v1/courses/:id
 * @access public
 */
exports.updateCourse = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const body = req.body
  let course = await Course.findById(id)

  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!course) {
    return next(error)
  }

  course = await Course.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: course })
})

/**
 * @desc   删除课程
 * @route  DELETE /api/v1/courses/:id
 * @access private
 */
exports.deleteCourse = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const course = await Course.findById(id)
  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!course) {
    return next(error)
  }

  course.remove()

  res.status(200).json({ success: true, data: {} })
})

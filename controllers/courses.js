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

  if (!camp) {
    return next(notFoundError(campId))
  }

  if (camp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`该用户${req.user.id}无权限在此训练营添加课程`, 401)
    )
  }

  const course = await Course.create({
    camp: campId,
    user: req.user.id,
    ...req.body,
  })
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

  if (!course) {
    return next(notFoundError(id))
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

  if (!course) {
    return next(notFoundError(id))
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.user.id}无权限更新此课程`, 401))
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

  if (!course) {
    return next(notFoundError(id))
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.user.id}无权限删除此课程`, 401))
  }

  course.remove()

  res.status(200).json({ success: true, data: {} })
})

const notFoundError = id => {
  return new ErrorResponse(`Resource not found with the value of ${id}`, 404)
}

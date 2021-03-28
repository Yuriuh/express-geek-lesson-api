const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   获取所有课程
 * @route  GET /api/v1/courses
 * @access 公开的
 */
exports.getCourses = asnycHandler(async (req, res, next) => {
  const { query } = req
  const reqQuery = { ...query }

  const fieldsToRemove = ['select', 'sort', 'page', 'limit']
  fieldsToRemove.forEach(field => delete reqQuery[field])

  const queryString = JSON.stringify(reqQuery)
  const replacedQueryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  )
  let dbQuery = Course.find(JSON.parse(replacedQueryString))

  if (query.select) {
    const selectBy = query.select.split(',').join(' ')
    dbQuery = dbQuery.select(selectBy)
  }

  if (query.sort) {
    const sortBy = query.sort.split(',').join(' ')
    dbQuery = dbQuery.sort(sortBy)
  } else {
    dbQuery = dbQuery.sort('-createdAt')
  }

  // 分页
  const page = parseInt(query.page, 10) || 1
  const limit = parseInt(query.limit, 10) || 2
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Course.countDocuments()

  dbQuery.skip(startIndex).limit(limit)

  const courses = await dbQuery

  // 分页返回值
  const pagination = {}
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit }
  }

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit }
  }

  const count = courses.length
  res.status(200).json({
    success: true,
    count,
    pagination,
    data: courses,
  })
})

/**
 * @desc   创建课程
 * @route  POST /api/v1/courses
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

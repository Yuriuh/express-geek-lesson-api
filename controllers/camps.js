const Camp = require('../models/Camp')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   获取所有训练营
 * @route  GET /api/v1/camps
 * @access 公开的
 */
exports.getCamps = asnycHandler(async (req, res, next) => {
  const { query } = req
  const reqQuery = { ...query }

  const fieldsToRemove = ['select', 'sort', 'page', 'limit']
  fieldsToRemove.forEach(field => delete reqQuery[field])

  const queryString = JSON.stringify(reqQuery)
  const replacedQueryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  )
  let dbQuery = Camp.find(JSON.parse(replacedQueryString))

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
  const total = await Camp.countDocuments()

  dbQuery.skip(startIndex).limit(limit)

  const camps = await dbQuery

  // 分页返回值
  const pagination = {}
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit }
  }

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit }
  }

  const count = camps.length
  res.status(200).json({
    success: true,
    count,
    pagination,
    data: camps,
  })
})

/**
 * @desc   创建课程
 * @route  POST /api/v1/camp
 * @access 公开的
 */
exports.createCamp = asnycHandler(async (req, res, next) => {
  const camp = await Camp.create(req.body)
  res.status(200).json({ success: true, data: camp })
})

/**
 * @desc   查看某个课程
 * @route  GET /api/v1/camp/:id
 * @access 公开的
 */
exports.getCamp = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const camp = await Camp.findById(id)
  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!camp) {
    return next(error)
  }

  res.status(200).json({ success: true, data: camp })
})

/**
 * @desc   更新课程
 * @route  PUT /api/v1/camp/:id
 * @access 公开的
 */
exports.updateCamp = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const body = req.body
  const camp = await Camp.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })

  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!camp) {
    return next(error)
  }

  res.status(200).json({ success: true, data: camp })
})

/**
 * @desc   课程课程
 * @route  DELETE /api/v1/camp/:id
 * @access 公开的
 */
exports.deleteCamp = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const camp = await Camp.findByIdAndDelete(id)
  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!camp) {
    return next(error)
  }

  res.status(200).json({ success: true, data: {} })
})

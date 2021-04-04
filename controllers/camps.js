const Camp = require('../models/Camp')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   获取所有训练营
 * @route  GET /api/v1/camps
 * @access public
 */
exports.getCamps = asnycHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

/**
 * @desc   创建训练营
 * @route  POST /api/v1/camps
 * @access public
 */
exports.createCamp = asnycHandler(async (req, res, next) => {
  // 从中间件获取 user
  req.body.user = req.user.id
  // 如果用户角色是 admin，那么可以创建多个机构信息，否则只能创建一个机构
  const publishedCamp = await Camp.findOne({ user: req.user.id })

  if (publishedCamp && req.user.role !== 'admin') {
    return next(new ErrorResponse('该机构已存在，请不要重复创建', 400))
  }

  const camp = await Camp.create(req.body)
  res.status(200).json({ success: true, data: camp })
})

/**
 * @desc   查看某个训练营
 * @route  GET /api/v1/camps/:id
 * @access public
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
 * @desc   更新某个训练营
 * @route  PUT /api/v1/camps/:id
 * @access public
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
 * @desc   删除某个训练营
 * @route  DELETE /api/v1/camps/:id
 * @access public
 */
exports.deleteCamp = asnycHandler(async (req, res, next) => {
  const id = req.params.id
  const camp = await Camp.findById(id)

  const error = new ErrorResponse(
    `Resource not found with the value of ${id}`,
    404
  )

  if (!camp) {
    return next(error)
  }

  camp.remove()

  res.status(200).json({ success: true, data: {} })
})

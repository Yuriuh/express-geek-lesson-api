const Review = require('../models/Review.js')
const Camp = require('../models/Camp.js')
const ErrorResponse = require('../utils/errorResponse.js')
const asyncHandler = require('../middleware/async.js')

/**
 * @desc    获取所有评论
 * @route   GET /api/v1/reviews
 * @route   GET /api/v1/camps/:campId/reviews
 * @access  公开的
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.campId) {
    const reivews = await Review.find({ camp: req.params.campId })
    return res
      .status(200)
      .json({ success: true, count: reivews.length, data: reivews })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

/**
 * @desc    根据 id 获取某个评论
 * @route   GET /api/v1/reviews/:id
 * @access  公开的
 */
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'camp',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    )
  }
  res.status(200).json({ success: true, data: review })
})

/**
 * @desc    添加评论数据
 * @route   POST /api/v1/camps/:campId/reviews
 * @access  private
 */
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.camp = req.params.campId
  req.body.user = req.user.id
  // 先查询米修机构的数据是否存在
  const camp = await Camp.findById(req.params.campId)

  // 没查到,返回错误信息
  if (!camp) {
    return next(
      new ErrorResponse(
        `Resource not found with id of ${req.params.campId}`,
        404
      )
    )
  }

  // 确定当前的 id 和登录的用户 id 是一致的
  if (camp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`该用户${req.user.id}无权限删除此数据`, 401))
  }

  // 查到有 camp 数据，然后追加课程数据
  const review = await Review.create(req.body)

  res.status(200).json({ success: true, data: review })
})

/**
 * @desc    根据 id 更新评论数据
 * @route   PUT /api/v1/reviews/:id
 * @access  private
 */
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    )
  }

  // 确定当前的id和登录的用户id是一致的
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`该用户${req.user.id}无权限更新此评论数据`, 401)
    )
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: review })
})

/**
 * @desc    根据id删除评论数据
 * @route   DELETE /api/v1/reviews/:id
 * @access  private
 */
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
    )
  }

  // 确定当前的 id 和登录的用户 id 是一致的
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`该用户${req.user.id}无权限删除此评论数据`, 401)
    )
  }

  review.remove()

  res.status(200).json({ success: true, data: {} })
})

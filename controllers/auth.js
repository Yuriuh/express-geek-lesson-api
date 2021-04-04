const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   注册
 * @route  GET /api/v1/auth/register
 * @access public
 */
exports.register = asnycHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body
  // 注册用户
  const user = await User.create({ name, email, password, role })
  // 生成 token
  const token = user.getSignedJwtToken()
  res.status(200).json({ success: true, token })
})

/**
 * @desc   登录
 * @route  GET /api/v1/auth/login
 * @access public
 */
exports.login = asnycHandler(async (req, res, next) => {
  const { email, password } = req.body

  // 验证邮箱和密码是否为空
  if (!email || !password) {
    return next(new ErrorResponse('请填写邮箱和密码', 400))
  }

  // 获取用户信息
  const user = await User.findOne({ email }).select('+password')
  console.log('user', user)

  if (!user) {
    return next(new ErrorResponse('找不到用户', 400))
  }

  // 密码匹配
  const isMatched = user.matchPassword(password)

  if (!isMatched) {
    return next(new ErrorResponse('密码错误', 400))
  }

  // 生成 token
  const token = user.getSignedJwtToken()

  res.status(200).json({ success: true, token })
})

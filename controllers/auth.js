const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   注册
 * @route  POST /api/v1/auth/register
 * @access public
 */
exports.register = asnycHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body
  // 注册用户
  const user = await User.create({ name, email, password, role })
  // 生成 token
  sendTokenResponse(user, 200, res)
})

/**
 * @desc   登录
 * @route  POST /api/v1/auth/login
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
  const isMatched = await user.matchPassword(password)

  if (!isMatched) {
    return next(new ErrorResponse('密码错误', 401))
  }

  // 生成 token
  sendTokenResponse(user, 200, res)
})

/**
 * @desc   获取当前登录用户信息
 * @route  GET /api/v1/auth/me
 * @access public
 */
exports.getMe = asnycHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({ success: true, data: user })
})

/**
 * @desc   更新当前登录用户信息
 * @route  PUT /api/v1/auth/update-details
 * @access private
 */
exports.updateDetails = asnycHandler(async (req, res, next) => {
  const { name, email } = req.body
  const fieldsToUpdate = {}
  if (name) {
    fieldsToUpdate.name = name
  }
  if (email) {
    fieldsToUpdate.email = email
  }
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: user })
})

/**
 * @desc   更新当前登录用户密码
 * @route  PUT /api/v1/auth/update-password
 * @access private
 */
exports.updatePassword = asnycHandler(async (req, res, next) => {
  // 旧密码 新密码
  const user = await User.findById(req.user.id).select('+password')

  // 判断旧密码和数据库密码是否一致
  const isMatched = await user.matchPassword(req.body.currentPassword)
  if (!isMatched) {
    return next(new ErrorResponse('密码错误', 401))
  }

  const isEqual = await user.matchPassword(req.body.newPassword)
  if (isEqual) {
    return next(new ErrorResponse('新密码不可与原密码相同', 400))
  }

  // 更新密码
  user.password = req.body.newPassword

  // 存储到数据库
  await user.save()

  sendTokenResponse(user, 200, res)
})

// 生成 token 并存储到 cookie 的方法
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken()
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  })
}

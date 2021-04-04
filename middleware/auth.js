const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const jwt = require('jsonwebtoken')

exports.protect = asyncHandler(async (req, res, next) => {
  let token
  // 判断该请求是否拥有token
  const authorization = req.headers.authorization
  const tokenFromCookie = req.cookies.token
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1]
  } else if (token) {
    token = tokenFromCookie
  }

  // 校验 token 是否存在
  if (!token) {
    return next(new ErrorResponse('没有权限', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  } catch (error) {
    return next(new ErrorResponse('没有权限', 401))
  }
})

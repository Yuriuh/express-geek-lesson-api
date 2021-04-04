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

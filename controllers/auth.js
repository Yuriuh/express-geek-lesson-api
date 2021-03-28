const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asnycHandler = require('../middleware/async')

/**
 * @desc   注册
 * @route  GET /api/v1/auth/register
 * @access public
 */
exports.register = asnycHandler(async (req, res, next) => {
  res.status(200).json({ success: true })
})

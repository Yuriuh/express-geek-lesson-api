const express = require('express')
const router = express.Router()

// 引入控制器
const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} = require('../controllers/auth')

// 路由鉴权
const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/update-details', protect, updateDetails)
router.put('/update-password', protect, updatePassword)

module.exports = router

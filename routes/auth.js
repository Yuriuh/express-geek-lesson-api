const express = require('express')
const router = express.Router()

// 引入控制器
const { register, login, getMe } = require('../controllers/auth')

// 路由鉴权
const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)

module.exports = router

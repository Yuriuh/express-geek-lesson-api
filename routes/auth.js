const express = require('express')
const router = express.Router()

// 引入控制器
const { register, login } = require('../controllers/auth')

router.post('/register', register)
router.post('/login', login)

module.exports = router

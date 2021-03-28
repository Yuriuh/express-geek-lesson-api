const express = require('express')
const router = express.Router()

// 引入控制器
const { register } = require('../controllers/auth')

router.post('/register', register)

module.exports = router

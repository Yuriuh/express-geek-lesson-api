const express = require('express')
const router = express.Router()

// 引入控制器
const {
  getCamps,
  getCamp,
  createCamp,
  updateCamp,
  deleteCamp,
} = require('../controllers/camps')

// 路由鉴权
const { protect } = require('../middleware/auth')

const advancedResults = require('../middleware/advancedResults')
const Camp = require('../models/Camp')

// 定向路由
const courseRouter = require('./courses')
router.use('/:campId/courses', courseRouter)

router
  .route('/')
  .get(advancedResults(Camp, 'courses'), getCamps)
  .post(protect, createCamp)

router
  .route('/:id')
  .get(getCamp)
  .put(protect, updateCamp)
  .delete(protect, deleteCamp)

module.exports = router

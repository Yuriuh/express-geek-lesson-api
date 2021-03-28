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

router.route('/').get(getCamps).post(createCamp)

router.route('/:id').get(getCamp).put(updateCamp).delete(deleteCamp)

module.exports = router

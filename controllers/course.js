const Course = require('../models/Course')

/**
 * @desc   获取所有课程
 * @route  GET /api/v1/course
 * @access 公开的
 */
exports.getCourseAll = async (req, res, next) => {
  try {
    const courses = await Course.find()
    const count = courses.length
    res.status(200).json({ success: true, count, data: courses })
  } catch (error) {
    res.status(200).json({ success: true, error })
  }
}

/**
 * @desc   创建课程
 * @route  POST /api/v1/course
 * @access 公开的
 */
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body)
    res.status(200).json({ success: true, data: course })
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
}

/**
 * @desc   查看某个课程
 * @route  GET /api/v1/course/:id
 * @access 公开的
 */
exports.getCourse = async (req, res, next) => {
  try {
    const id = req.params.id
    const course = await Course.findById(id)

    if (!course) {
      return res.status(400).json({ success: false, data: {} })
    }

    res.status(200).json({ success: true, data: course })
  } catch (error) {
    // res.status(400).json({ success: false, error })
    next(error)
  }
}

/**
 * @desc   更新课程
 * @route  PUT /api/v1/course/:id
 * @access 公开的
 */
exports.updateCourse = async (req, res, next) => {
  try {
    const id = req.params.id
    const body = req.body
    const course = await Course.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!course) {
      return res.status(400).json({ success: false, data: {} })
    }

    res.status(200).json({ success: true, data: course })
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
}

/**
 * @desc   课程课程
 * @route  DELETE /api/v1/course/:id
 * @access 公开的
 */
exports.deleteCourse = async (req, res, next) => {
  try {
    const id = req.params.id
    const course = await Course.findByIdAndDelete(id)

    if (!course) {
      return res.status(400).json({ success: false, data: {} })
    }

    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
}

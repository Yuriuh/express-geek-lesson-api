exports.getCourseAll = (req, res, next) => {
  console.log('request')
  res.status(200).json({ success: true, msg: '获取所有课程' })
}

exports.createCourse = (req, res, next) => {
  res.status(200).json({ success: true, msg: `创建课程` })
}

exports.getCourse = (req, res, next) => {
  res.status(200).json({ success: true, msg: `获取第${req.params.id}节课程` })
}

exports.updateCourse = (req, res, next) => {
  res.status(200).json({ success: true, msg: `更新第${req.params.id}节课程` })
}

exports.deleteCourse = (req, res, next) => {
  res.status(200).json({ success: true, msg: `删除第${req.params.id}节课程` })
}

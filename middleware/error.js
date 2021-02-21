const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red)
  let error = err

  if (err.name === 'CastError') {
    const message = `Resource not found with the value of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  if (err.code === 11000) {
    const message = '输入了重复的字段值'
    error = new ErrorResponse(message, 404)
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(v => v.message)
      .join(', ')
    error = new ErrorResponse(message, 400)
  }

  res
    .status(err.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' })
}

module.exports = errorHandler

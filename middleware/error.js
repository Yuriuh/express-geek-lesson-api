const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red)
  let error = err

  if (err.name === 'CastError') {
    const message = `Resource not found with the value of ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  res
    .status(err.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' })
}

module.exports = errorHandler

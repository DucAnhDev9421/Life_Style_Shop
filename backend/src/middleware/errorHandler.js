const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500
  let code = err.code || 'INTERNAL_SERVER_ERROR'
  let message = err.message || 'Something went wrong'

  if (err.name === 'CastError') {
    statusCode = 400
    code = 'VALIDATION_ERROR'
    message = 'ID không hợp lệ'
  }
  if (err.code === 11000) {
    statusCode = 409
    code = 'CONFLICT'
    message = 'Dữ liệu trùng (unique)'
  }

  res.status(statusCode).json({
    success: false,
    code,
    message,
  })
}

module.exports = errorHandler

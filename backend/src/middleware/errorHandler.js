const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Something went wrong',
  })
}

module.exports = errorHandler

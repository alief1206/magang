function errorMiddleware(error, _req, res, _next) {
  const statusCode = error.statusCode || 500

  res.status(statusCode).json({
    message: error.message || 'Terjadi kesalahan pada server.',
  })
}

module.exports = errorMiddleware

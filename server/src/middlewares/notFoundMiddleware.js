function notFoundMiddleware(req, res) {
  res.status(404).json({
    message: `Route ${req.originalUrl} tidak ditemukan.`,
  })
}

module.exports = notFoundMiddleware

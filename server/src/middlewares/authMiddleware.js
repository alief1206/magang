function authMiddleware(req, _res, next) {
  // Isi pengecekan login/session/token di sini saat fitur auth sudah dibuat.
  req.user = null
  next()
}

module.exports = authMiddleware

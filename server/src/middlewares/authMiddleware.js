function authMiddleware(req, _res, next) {
  // Nanti isi dari token/session login.
  req.user = null
  next()
}

module.exports = authMiddleware

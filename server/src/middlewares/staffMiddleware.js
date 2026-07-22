function staffMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: 'Login terlebih dahulu.',
    })
  }

  if (!['admin', 'lurah'].includes(req.user.role)) {
    return res.status(403).json({
      message: 'Akses hanya untuk admin atau lurah.',
    })
  }

  if (!req.user.kelurahanId) {
    return res.status(403).json({
      message: 'Akun belum terhubung dengan kelurahan.',
    })
  }

  next()
}

module.exports = staffMiddleware

const tokenService = require('../utils/token')

function authMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization || ''
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length)
    : req.headers['x-auth-token']

  if (!token) {
    return res.status(401).json({
      message: 'Token login wajib dikirim.',
    })
  }

  try {
    req.user = tokenService.verifyToken(token)
    next()
  } catch (error) {
    res.status(401).json({
      message: error.message,
    })
  }
}

module.exports = authMiddleware

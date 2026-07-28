const tokenService = require('../utils/token')

function optionalAuthMiddleware(req, res, next) {
  const authorizationHeader = req.headers.authorization || ''
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length)
    : req.headers['x-auth-token']

  if (!token) {
    return next()
  }

  try {
    req.user = tokenService.verifyToken(token)
  } catch (error) {
    // Abaikan error token jika opsional, biarkan user tidak terdefinisi
  }
  
  next()
}

module.exports = optionalAuthMiddleware

const authService = require('../services/authService')

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body)

    res.status(201).json({
      message: 'Registrasi berhasil.',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body)

    res.json({
      message: 'Login berhasil.',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
}

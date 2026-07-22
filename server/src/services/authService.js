const userModel = require('../models/userModel')
const createApiError = require('../utils/apiError')
const passwordService = require('../utils/password')
const tokenService = require('../utils/token')
const authValidator = require('../validators/authValidator')

function createAuthResponse(user) {
  const token = tokenService.createToken({
    id: user.id,
    email: user.email,
    role: user.role,
    kelurahanId: user.kelurahanId,
  })

  return {
    token,
    user: {
      id: user.id,
      kelurahanId: user.kelurahanId,
      kelurahanName: user.kelurahanName,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

async function register(payload) {
  const errors = authValidator.validateRegisterPayload(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const hashedPassword = await passwordService.hashPassword(payload.password)
  const user = await userModel.create({
    ...payload,
    password: hashedPassword,
    role: payload.role || 'warga',
  })

  return createAuthResponse(user)
}

async function login(payload) {
  const errors = authValidator.validateLoginPayload(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const user = await userModel.findByEmailForAuth(payload.email)

  if (!user) {
    throw createApiError('Email atau password salah.', 401)
  }

  const isValidPassword = await passwordService.verifyPassword(payload.password, user.password)

  if (!isValidPassword) {
    throw createApiError('Email atau password salah.', 401)
  }

  return createAuthResponse(user)
}

module.exports = {
  register,
  login,
}

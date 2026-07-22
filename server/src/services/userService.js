const userModel = require('../models/userModel')
const createApiError = require('../utils/apiError')
const passwordService = require('../utils/password')
const userValidator = require('../validators/userValidator')

async function getUsers() {
  return userModel.findAll()
}

async function getUserById(id) {
  const user = await userModel.findById(id)

  if (!user) {
    throw createApiError('User tidak ditemukan.', 404)
  }

  return user
}

async function createUser(payload) {
  const errors = userValidator.validateCreateUser(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const hashedPassword = await passwordService.hashPassword(payload.password)

  return userModel.create({
    ...payload,
    password: hashedPassword,
  })
}

async function updateUser(id, payload) {
  const errors = userValidator.validateUpdateUser(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getUserById(id)
  const nextPayload = { ...payload }

  if (payload.password) {
    nextPayload.password = await passwordService.hashPassword(payload.password)
  }

  return userModel.update(id, nextPayload)
}

async function deleteUser(id) {
  await getUserById(id)
  await userModel.remove(id)
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

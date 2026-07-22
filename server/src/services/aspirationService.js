const aspirationModel = require('../models/aspirationModel')
const createApiError = require('../utils/apiError')
const aspirationValidator = require('../validators/aspirationValidator')
const imageCompressionService = require('./imageCompressionService')

async function getAspirations(filters) {
  return aspirationModel.findAll(filters)
}

async function getAspirationById(id) {
  const aspiration = await aspirationModel.findById(id)

  if (!aspiration) {
    throw createApiError('Aspirasi tidak ditemukan.', 404)
  }

  const responses = await aspirationModel.findResponses(id)

  return {
    ...aspiration,
    responses,
  }
}

async function createAspiration(payload) {
  const errors = aspirationValidator.validateCreateAspiration(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const imageMetadata = imageCompressionService.prepareImageMetadata(payload.image)

  return aspirationModel.create({
    userId: payload.userId,
    name: payload.name,
    address: payload.address,
    category: payload.category,
    shortTitle: payload.shortTitle,
    description: payload.description,
    assignedToRole: payload.assignedToRole,
    ...imageMetadata,
  })
}

async function updateStatus(id, status) {
  if (!aspirationValidator.isValidStatus(status)) {
    throw createApiError('Status aspirasi tidak valid.', 400)
  }

  const aspiration = await aspirationModel.updateStatus(id, status)

  if (!aspiration) {
    throw createApiError('Aspirasi tidak ditemukan.', 404)
  }

  return aspiration
}

async function addResponse(aspirationId, payload) {
  const errors = aspirationValidator.validateCreateResponse(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const aspiration = await aspirationModel.findById(aspirationId)

  if (!aspiration) {
    throw createApiError('Aspirasi tidak ditemukan.', 404)
  }

  return aspirationModel.addResponse({
    aspirationId,
    responderId: payload.responderId,
    responderRole: payload.responderRole,
    response: payload.response,
  })
}

module.exports = {
  getAspirations,
  getAspirationById,
  createAspiration,
  updateStatus,
  addResponse,
}

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
    ...payload,
    ...imageMetadata,
  })
}

async function updateAspiration(id, payload) {
  const errors = aspirationValidator.validateUpdateAspiration(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getAspirationById(id)

  const imageMetadata =
    payload.image === undefined ? {} : imageCompressionService.prepareImageMetadata(payload.image)

  return aspirationModel.update(id, {
    ...payload,
    ...imageMetadata,
  })
}

async function deleteAspiration(id) {
  await getAspirationById(id)
  await aspirationModel.remove(id)
}

async function addResponse(aspirationId, payload) {
  const errors = aspirationValidator.validateResponse(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getAspirationById(aspirationId)

  return aspirationModel.addResponse({
    aspirationId,
    responderId: payload.responderId,
    responderRole: payload.responderRole,
    response: payload.response,
  })
}

async function updateResponse(aspirationId, responseId, payload) {
  const errors = aspirationValidator.validateResponse(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getAspirationById(aspirationId)

  const response = await aspirationModel.updateResponse(aspirationId, responseId, payload)

  if (!response) {
    throw createApiError('Tanggapan tidak ditemukan.', 404)
  }

  return response
}

async function deleteResponse(aspirationId, responseId) {
  await getAspirationById(aspirationId)

  const deleted = await aspirationModel.removeResponse(aspirationId, responseId)

  if (!deleted) {
    throw createApiError('Tanggapan tidak ditemukan.', 404)
  }
}

module.exports = {
  getAspirations,
  getAspirationById,
  createAspiration,
  updateAspiration,
  deleteAspiration,
  addResponse,
  updateResponse,
  deleteResponse,
}

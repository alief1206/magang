const aspirationModel = require('../models/aspirationModel')
const createApiError = require('../utils/apiError')
const aspirationValidator = require('../validators/aspirationValidator')
const imageCompressionService = require('./imageCompressionService')

function isStaff(user) {
  return user && ['admin', 'lurah'].includes(user.role)
}

function getScopedFilters(filters, user) {
  if (!user) {
    throw createApiError('Login terlebih dahulu.', 401)
  }

  if (isStaff(user)) {
    return {
      ...filters,
      kelurahanId: user.kelurahanId,
    }
  }

  return {
    ...filters,
    userId: user.id,
  }
}

function ensureCanAccessAspiration(aspiration, user) {
  if (!user) {
    throw createApiError('Login terlebih dahulu.', 401)
  }

  if (isStaff(user) && Number(aspiration.kelurahanId) === Number(user.kelurahanId)) {
    return
  }

  if (user.role === 'warga' && Number(aspiration.userId) === Number(user.id)) {
    return
  }

  throw createApiError('Anda tidak memiliki akses ke aspirasi kelurahan lain.', 403)
}

async function getAspirations(filters, user) {
  return aspirationModel.findAll(getScopedFilters(filters, user))
}

async function getAspirationById(id, user) {
  const aspiration = await aspirationModel.findById(id)

  if (!aspiration) {
    throw createApiError('Aspirasi tidak ditemukan.', 404)
  }

  ensureCanAccessAspiration(aspiration, user)

  const responses = await aspirationModel.findResponses(id)

  return {
    ...aspiration,
    responses,
  }
}

async function createAspiration(payload, user) {
  const errors = aspirationValidator.validateCreateAspiration(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const imageMetadata = await imageCompressionService.storeImage(payload.image)
  const userKelurahanId = user && user.kelurahanId
  const kelurahanId = payload.kelurahanId || userKelurahanId

  if (!kelurahanId) {
    throw createApiError('Kelurahan wajib dipilih.', 400)
  }

  if (isStaff(user) && Number(kelurahanId) !== Number(user.kelurahanId)) {
    throw createApiError('Admin hanya boleh membuat aspirasi untuk kelurahannya sendiri.', 403)
  }

  return aspirationModel.create({
    ...payload,
    name: payload.name.trim(),
    address: payload.address.trim(),
    shortTitle: payload.shortTitle.trim(),
    description: payload.description.trim(),
    userId: payload.userId || (user && user.role === 'warga' ? user.id : undefined),
    kelurahanId,
    ...imageMetadata,
  })
}

async function updateAspiration(id, payload, user) {
  const errors = aspirationValidator.validateUpdateAspiration(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const existingAspiration = await getAspirationById(id, user)

  if (payload.kelurahanId && Number(payload.kelurahanId) !== Number(existingAspiration.kelurahanId)) {
    throw createApiError('Kelurahan aspirasi tidak boleh dipindahkan dari route ini.', 400)
  }

  const imageMetadata =
    payload.image === undefined ? {} : await imageCompressionService.storeImage(payload.image)

  return aspirationModel.update(id, {
    ...payload,
    ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
    ...(payload.address !== undefined ? { address: payload.address.trim() } : {}),
    ...(payload.shortTitle !== undefined ? { shortTitle: payload.shortTitle.trim() } : {}),
    ...(payload.description !== undefined ? { description: payload.description.trim() } : {}),
    ...imageMetadata,
  })
}

async function deleteAspiration(id, user) {
  await getAspirationById(id, user)
  await aspirationModel.remove(id)
}

async function forwardToLurah(id, user) {
  const aspiration = await getAspirationById(id, user)

  if (user.role !== 'admin') {
    throw createApiError('Hanya admin yang dapat meneruskan aspirasi ke lurah.', 403)
  }

  if (aspiration.assignedToRole === 'lurah' && aspiration.status === 'diteruskan_ke_lurah') {
    throw createApiError('Aspirasi sudah diteruskan ke lurah.', 400)
  }

  return aspirationModel.forwardToLurah({
    aspirationId: id,
    kelurahanId: aspiration.kelurahanId,
    forwardedBy: user.id,
  })
}

async function getLurahNotifications(user) {
  if (!user || user.role !== 'lurah') {
    throw createApiError('Akses hanya untuk lurah.', 403)
  }

  return aspirationModel.findNotificationsForLurah(user.kelurahanId)
}

async function addResponse(aspirationId, payload, user) {
  const responsePayload = {
    ...payload,
    responderId: payload.responderId || (user && user.id),
    responderRole: payload.responderRole || (user && user.role),
  }
  const errors = aspirationValidator.validateResponse(responsePayload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getAspirationById(aspirationId, user)

  return aspirationModel.addResponse({
    aspirationId,
    responderId: responsePayload.responderId,
    responderRole: responsePayload.responderRole,
    response: responsePayload.response,
  })
}

async function updateResponse(aspirationId, responseId, payload, user) {
  const responsePayload = {
    ...payload,
    responderId: payload.responderId || (user && user.id),
    responderRole: payload.responderRole || (user && user.role),
  }
  const errors = aspirationValidator.validateResponse(responsePayload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getAspirationById(aspirationId, user)

  const response = await aspirationModel.updateResponse(aspirationId, responseId, responsePayload)

  if (!response) {
    throw createApiError('Tanggapan tidak ditemukan.', 404)
  }

  return response
}

async function deleteResponse(aspirationId, responseId, user) {
  await getAspirationById(aspirationId, user)

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
  forwardToLurah,
  getLurahNotifications,
  addResponse,
  updateResponse,
  deleteResponse,
}

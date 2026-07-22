const kelurahanModel = require('../models/kelurahanModel')
const createApiError = require('../utils/apiError')
const kelurahanValidator = require('../validators/kelurahanValidator')

async function getKelurahans() {
  return kelurahanModel.findAll()
}

async function getKelurahanById(id) {
  const kelurahan = await kelurahanModel.findById(id)

  if (!kelurahan) {
    throw createApiError('Kelurahan tidak ditemukan.', 404)
  }

  return kelurahan
}

async function createKelurahan(payload) {
  const errors = kelurahanValidator.validateCreateKelurahan(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  return kelurahanModel.create(payload)
}

async function updateKelurahan(id, payload) {
  await getKelurahanById(id)
  return kelurahanModel.update(id, payload)
}

async function deleteKelurahan(id) {
  await getKelurahanById(id)
  await kelurahanModel.remove(id)
}

module.exports = {
  getKelurahans,
  getKelurahanById,
  createKelurahan,
  updateKelurahan,
  deleteKelurahan,
}

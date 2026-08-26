const kelurahanService = require('../services/kelurahanService')

async function getKelurahans(_req, res, next) {
  try {
    const kelurahans = await kelurahanService.getKelurahans()

    res.json({
      data: kelurahans,
    })
  } catch (error) {
    next(error)
  }
}

async function getKelurahanById(req, res, next) {
  try {
    const kelurahan = await kelurahanService.getKelurahanById(req.params.id)

    res.json({
      data: kelurahan,
    })
  } catch (error) {
    next(error)
  }
}

async function createKelurahan(req, res, next) {
  try {
    const kelurahan = await kelurahanService.createKelurahan(req.body)

    res.status(201).json({
      message: 'Kelurahan berhasil ditambahkan.',
      data: kelurahan,
    })
  } catch (error) {
    next(error)
  }
}

async function updateKelurahan(req, res, next) {
  try {
    const kelurahan = await kelurahanService.updateKelurahan(req.params.id, req.body)

    res.json({
      message: 'Kelurahan berhasil diubah.',
      data: kelurahan,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteKelurahan(req, res, next) {
  try {
    await kelurahanService.deleteKelurahan(req.params.id)

    res.json({
      message: 'Kelurahan berhasil dihapus.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getKelurahans,
  getKelurahanById,
  createKelurahan,
  updateKelurahan,
  deleteKelurahan,
}

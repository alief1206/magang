const aspirationService = require('../services/aspirationService')

async function getAspirations(req, res, next) {
  try {
    const aspirations = await aspirationService.getAspirations({
      status: req.query.status,
      category: req.query.category,
      assignedToRole: req.query.assignedToRole,
    })

    res.json({
      data: aspirations,
    })
  } catch (error) {
    next(error)
  }
}

async function getAspirationById(req, res, next) {
  try {
    const aspiration = await aspirationService.getAspirationById(req.params.id)

    res.json({
      data: aspiration,
    })
  } catch (error) {
    next(error)
  }
}

async function createAspiration(req, res, next) {
  try {
    const aspiration = await aspirationService.createAspiration(req.body)

    res.status(201).json({
      message: 'Aspirasi berhasil dikirim.',
      data: aspiration,
    })
  } catch (error) {
    next(error)
  }
}

async function updateStatus(req, res, next) {
  try {
    const aspiration = await aspirationService.updateStatus(req.params.id, req.body.status)

    res.json({
      message: 'Status aspirasi berhasil diubah.',
      data: aspiration,
    })
  } catch (error) {
    next(error)
  }
}

async function addResponse(req, res, next) {
  try {
    const response = await aspirationService.addResponse(req.params.id, req.body)

    res.status(201).json({
      message: 'Tanggapan aspirasi berhasil disimpan.',
      data: response,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAspirations,
  getAspirationById,
  createAspiration,
  updateStatus,
  addResponse,
}

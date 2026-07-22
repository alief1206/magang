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
      message: 'Aspirasi berhasil ditambahkan.',
      data: aspiration,
    })
  } catch (error) {
    next(error)
  }
}

async function updateAspiration(req, res, next) {
  try {
    const aspiration = await aspirationService.updateAspiration(req.params.id, req.body)

    res.json({
      message: 'Aspirasi berhasil diubah.',
      data: aspiration,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteAspiration(req, res, next) {
  try {
    await aspirationService.deleteAspiration(req.params.id)

    res.json({
      message: 'Aspirasi berhasil dihapus.',
    })
  } catch (error) {
    next(error)
  }
}

async function addResponse(req, res, next) {
  try {
    const response = await aspirationService.addResponse(req.params.id, req.body)

    res.status(201).json({
      message: 'Tanggapan berhasil ditambahkan.',
      data: response,
    })
  } catch (error) {
    next(error)
  }
}

async function updateResponse(req, res, next) {
  try {
    const response = await aspirationService.updateResponse(
      req.params.id,
      req.params.responseId,
      req.body,
    )

    res.json({
      message: 'Tanggapan berhasil diubah.',
      data: response,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteResponse(req, res, next) {
  try {
    await aspirationService.deleteResponse(req.params.id, req.params.responseId)

    res.json({
      message: 'Tanggapan berhasil dihapus.',
    })
  } catch (error) {
    next(error)
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

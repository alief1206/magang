const express = require('express')
const aspirationController = require('../controllers/aspirationController')

const router = express.Router()

router.get('/', aspirationController.getAspirations)
router.post('/', aspirationController.createAspiration)
router.get('/:id', aspirationController.getAspirationById)
router.put('/:id', aspirationController.updateAspiration)
router.delete('/:id', aspirationController.deleteAspiration)
router.post('/:id/responses', aspirationController.addResponse)
router.put('/:id/responses/:responseId', aspirationController.updateResponse)
router.delete('/:id/responses/:responseId', aspirationController.deleteResponse)

module.exports = router

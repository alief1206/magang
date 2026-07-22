const express = require('express')
const aspirationController = require('../controllers/aspirationController')

const router = express.Router()

router.get('/', aspirationController.getAspirations)
router.post('/', aspirationController.createAspiration)
router.get('/:id', aspirationController.getAspirationById)
router.patch('/:id/status', aspirationController.updateStatus)
router.post('/:id/responses', aspirationController.addResponse)

module.exports = router

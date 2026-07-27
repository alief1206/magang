const express = require('express')
const aspirationController = require('../controllers/aspirationController')
const authMiddleware = require('../middlewares/authMiddleware')
const adminMiddleware = require('../middlewares/adminMiddleware')
const staffMiddleware = require('../middlewares/staffMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.get('/', aspirationController.getAspirations)
router.post('/', aspirationController.createAspiration)
router.get('/notifications/lurah', aspirationController.getLurahNotifications)
router.post('/:id/forward-to-lurah', adminMiddleware, aspirationController.forwardToLurah)
router.get('/:id', aspirationController.getAspirationById)
router.put('/:id', staffMiddleware, aspirationController.updateAspiration)
router.delete('/:id', staffMiddleware, aspirationController.deleteAspiration)
router.post('/:id/responses', staffMiddleware, aspirationController.addResponse)
router.put('/:id/responses/:responseId', staffMiddleware, aspirationController.updateResponse)
router.delete('/:id/responses/:responseId', staffMiddleware, aspirationController.deleteResponse)

module.exports = router

const express = require('express')
const aspirationController = require('../controllers/aspirationController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const staffMiddleware = require('../middlewares/staffMiddleware')
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware')

const router = express.Router()

router.post('/', optionalAuthMiddleware, aspirationController.createAspiration)
router.get('/', authMiddleware, aspirationController.getAspirations)
router.get('/notifications/lurah', authMiddleware, aspirationController.getLurahNotifications)
router.get('/:id', optionalAuthMiddleware, aspirationController.getAspirationById)
router.put('/:id', authMiddleware, staffMiddleware, aspirationController.updateAspiration)
router.delete('/:id', authMiddleware, staffMiddleware, aspirationController.deleteAspiration)
router.post('/:id/forward-to-lurah', authMiddleware, staffMiddleware, aspirationController.forwardToLurah)
router.post('/:id/responses', authMiddleware, staffMiddleware, aspirationController.addResponse)
router.put('/:id/responses/:responseId', authMiddleware, staffMiddleware, aspirationController.updateResponse)
router.delete('/:id/responses/:responseId', authMiddleware, staffMiddleware, aspirationController.deleteResponse)

module.exports = router

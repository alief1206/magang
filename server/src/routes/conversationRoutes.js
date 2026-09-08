const express = require('express')
const conversationController = require('../controllers/conversationController')
const authMiddleware = require('../middlewares/authMiddleware')
const staffMiddleware = require('../middlewares/staffMiddleware')
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware')

const router = express.Router()

// Rute yang bisa diakses warga (tanpa login) ATAU admin (dengan login)
router.post('/', optionalAuthMiddleware, conversationController.createConversation)
router.get('/:id', optionalAuthMiddleware, conversationController.getConversationById)
router.post('/:id/messages', optionalAuthMiddleware, conversationController.addMessage)

// Rute yang khusus Admin / Lurah
router.use(authMiddleware)
router.use(staffMiddleware)

router.get('/', conversationController.getConversations)
router.put('/:id', conversationController.updateConversation)
router.delete('/:id', conversationController.deleteConversation)
router.post('/:id/forward-to-lurah', conversationController.forwardToLurah)
router.put('/:id/messages/:messageId', conversationController.updateMessage)
router.delete('/:id/messages/:messageId', conversationController.deleteMessage)

module.exports = router

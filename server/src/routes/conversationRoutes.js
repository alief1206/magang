const express = require('express')
const conversationController = require('../controllers/conversationController')
const authMiddleware = require('../middlewares/authMiddleware')
const staffMiddleware = require('../middlewares/staffMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.get('/', conversationController.getConversations)
router.post('/', conversationController.createConversation)
router.get('/:id', conversationController.getConversationById)
router.put('/:id', staffMiddleware, conversationController.updateConversation)
router.delete('/:id', staffMiddleware, conversationController.deleteConversation)
router.post('/:id/messages', conversationController.addMessage)
router.put('/:id/messages/:messageId', staffMiddleware, conversationController.updateMessage)
router.delete('/:id/messages/:messageId', staffMiddleware, conversationController.deleteMessage)

module.exports = router

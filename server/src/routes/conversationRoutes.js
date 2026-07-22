const express = require('express')
const conversationController = require('../controllers/conversationController')

const router = express.Router()

router.get('/', conversationController.getConversations)
router.post('/', conversationController.createConversation)
router.get('/:id', conversationController.getConversationById)
router.put('/:id', conversationController.updateConversation)
router.delete('/:id', conversationController.deleteConversation)
router.post('/:id/messages', conversationController.addMessage)
router.put('/:id/messages/:messageId', conversationController.updateMessage)
router.delete('/:id/messages/:messageId', conversationController.deleteMessage)

module.exports = router

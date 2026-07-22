const express = require('express')
const conversationController = require('../controllers/conversationController')

const router = express.Router()

router.get('/', conversationController.getConversations)
router.post('/', conversationController.createConversation)
router.get('/:id/messages', conversationController.getMessages)
router.post('/:id/messages', conversationController.addMessage)
router.patch('/:id/status', conversationController.updateStatus)

module.exports = router

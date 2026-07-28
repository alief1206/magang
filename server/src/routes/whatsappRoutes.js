const express = require('express')
const whatsappController = require('../controllers/whatsappController')
const whatsappWebhookMiddleware = require('../middlewares/whatsappWebhookMiddleware')

const router = express.Router()

router.use(whatsappWebhookMiddleware)

router.post('/webhook/aspirations', whatsappController.receiveAspiration)
router.post('/webhook/chat-replies', whatsappController.receiveChatReply)

module.exports = router

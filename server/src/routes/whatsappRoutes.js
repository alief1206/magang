const express = require('express')
const whatsappController = require('../controllers/whatsappController')
const whatsappWebhookMiddleware = require('../middlewares/whatsappWebhookMiddleware')

const router = express.Router()

router.use(whatsappWebhookMiddleware)

router.post('/webhook/aspirations', whatsappController.receiveAspiration)

// Syarat dari Fonnte: Webhook URL must allow POST and GET method
router.get('/webhook/chat-replies', (req, res) => res.status(200).send('OK'))
router.post('/webhook/chat-replies', whatsappController.receiveChatReply)

module.exports = router

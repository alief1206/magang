const chatbotService = require('../services/chatbotService')

function sendMessage(req, res) {
  const { message } = req.body

  res.json({
    reply: chatbotService.generateReply(message),
  })
}

module.exports = {
  sendMessage,
}

const whatsappService = require('../services/whatsappService')

async function receiveAspiration(req, res, next) {
  try {
    const aspiration = await whatsappService.receiveAspiration(req.body)

    res.status(201).json({
      message: 'Aspirasi dari WhatsApp berhasil masuk ke website.',
      data: aspiration,
    })
  } catch (error) {
    next(error)
  }
}

async function receiveChatReply(req, res, next) {
  try {
    const message = await whatsappService.receiveChatReply(req.body)

    res.status(201).json({
      message: 'Balasan WhatsApp lurah berhasil masuk ke chat website.',
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  receiveAspiration,
  receiveChatReply,
}

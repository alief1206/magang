const conversationService = require('../services/conversationService')

async function getConversations(req, res, next) {
  try {
    const conversations = await conversationService.getConversations({
      status: req.query.status,
      targetRole: req.query.targetRole,
    })

    res.json({
      data: conversations,
    })
  } catch (error) {
    next(error)
  }
}

async function createConversation(req, res, next) {
  try {
    const result = await conversationService.createConversation(req.body)

    res.status(201).json({
      message: 'Percakapan berhasil dibuat.',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

async function getMessages(req, res, next) {
  try {
    const messages = await conversationService.getMessages(req.params.id)

    res.json({
      data: messages,
    })
  } catch (error) {
    next(error)
  }
}

async function addMessage(req, res, next) {
  try {
    const message = await conversationService.addMessage(req.params.id, req.body)

    res.status(201).json({
      message: 'Pesan berhasil dikirim.',
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

async function updateStatus(req, res, next) {
  try {
    const conversation = await conversationService.updateStatus(req.params.id, req.body.status)

    res.json({
      message: 'Status percakapan berhasil diubah.',
      data: conversation,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  addMessage,
  updateStatus,
}

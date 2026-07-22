const conversationService = require('../services/conversationService')

async function getConversations(req, res, next) {
  try {
    const conversations = await conversationService.getConversations({
      status: req.query.status,
      targetRole: req.query.targetRole,
      citizenId: req.query.citizenId,
    }, req.user)

    res.json({
      data: conversations,
    })
  } catch (error) {
    next(error)
  }
}

async function getConversationById(req, res, next) {
  try {
    const conversation = await conversationService.getConversationById(req.params.id, req.user)

    res.json({
      data: conversation,
    })
  } catch (error) {
    next(error)
  }
}

async function createConversation(req, res, next) {
  try {
    const conversation = await conversationService.createConversation(req.body, req.user)

    res.status(201).json({
      message: 'Percakapan berhasil ditambahkan.',
      data: conversation,
    })
  } catch (error) {
    next(error)
  }
}

async function updateConversation(req, res, next) {
  try {
    const conversation = await conversationService.updateConversation(req.params.id, req.body, req.user)

    res.json({
      message: 'Percakapan berhasil diubah.',
      data: conversation,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteConversation(req, res, next) {
  try {
    await conversationService.deleteConversation(req.params.id, req.user)

    res.json({
      message: 'Percakapan berhasil dihapus.',
    })
  } catch (error) {
    next(error)
  }
}

async function addMessage(req, res, next) {
  try {
    const message = await conversationService.addMessage(req.params.id, req.body, req.user)

    res.status(201).json({
      message: 'Pesan berhasil ditambahkan.',
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

async function updateMessage(req, res, next) {
  try {
    const message = await conversationService.updateMessage(
      req.params.id,
      req.params.messageId,
      req.body,
      req.user,
    )

    res.json({
      message: 'Pesan berhasil diubah.',
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

async function deleteMessage(req, res, next) {
  try {
    await conversationService.deleteMessage(req.params.id, req.params.messageId, req.user)

    res.json({
      message: 'Pesan berhasil dihapus.',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getConversations,
  getConversationById,
  createConversation,
  updateConversation,
  deleteConversation,
  addMessage,
  updateMessage,
  deleteMessage,
}

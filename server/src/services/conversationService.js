const conversationModel = require('../models/conversationModel')
const createApiError = require('../utils/apiError')
const conversationValidator = require('../validators/conversationValidator')

async function getConversations(filters) {
  return conversationModel.findAll(filters)
}

async function getConversationById(id) {
  const conversation = await conversationModel.findById(id)

  if (!conversation) {
    throw createApiError('Percakapan tidak ditemukan.', 404)
  }

  const messages = await conversationModel.findMessages(id)

  return {
    ...conversation,
    messages,
  }
}

async function createConversation(payload) {
  const errors = conversationValidator.validateConversation(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const conversation = await conversationModel.create(payload)

  if (payload.message) {
    const messageErrors = conversationValidator.validateMessage({
      senderId: payload.senderId || payload.citizenId,
      senderRole: payload.senderRole || 'warga',
      message: payload.message,
    })

    if (messageErrors.length) {
      throw createApiError(messageErrors.join(' '), 400)
    }

    await conversationModel.addMessage({
      conversationId: conversation.id,
      senderId: payload.senderId || payload.citizenId,
      senderRole: payload.senderRole || 'warga',
      message: payload.message,
    })
  }

  return getConversationById(conversation.id)
}

async function updateConversation(id, payload) {
  const errors = conversationValidator.validateConversation(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getConversationById(id)
  return conversationModel.update(id, payload)
}

async function deleteConversation(id) {
  await getConversationById(id)
  await conversationModel.remove(id)
}

async function addMessage(conversationId, payload) {
  const errors = conversationValidator.validateMessage(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getConversationById(conversationId)

  const message = await conversationModel.addMessage({
    conversationId,
    senderId: payload.senderId,
    senderRole: payload.senderRole,
    message: payload.message,
  })

  const status = payload.senderRole === 'warga' ? 'waiting_response' : 'answered'
  await conversationModel.update(conversationId, { status })

  return message
}

async function updateMessage(conversationId, messageId, payload) {
  const errors = conversationValidator.validateUpdateMessage(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getConversationById(conversationId)

  const message = await conversationModel.updateMessage(conversationId, messageId, payload)

  if (!message) {
    throw createApiError('Pesan tidak ditemukan.', 404)
  }

  return message
}

async function deleteMessage(conversationId, messageId) {
  await getConversationById(conversationId)

  const deleted = await conversationModel.removeMessage(conversationId, messageId)

  if (!deleted) {
    throw createApiError('Pesan tidak ditemukan.', 404)
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

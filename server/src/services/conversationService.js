const conversationModel = require('../models/conversationModel')
const createApiError = require('../utils/apiError')
const conversationValidator = require('../validators/conversationValidator')

async function getConversations(filters) {
  return conversationModel.findAll(filters)
}

async function createConversation(payload) {
  const errors = conversationValidator.validateCreateConversation(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const conversation = await conversationModel.create({
    citizenId: payload.citizenId,
    targetRole: payload.targetRole,
    subject: payload.subject,
  })

  let initialMessage = null

  if (payload.message) {
    initialMessage = await conversationModel.addMessage({
      conversationId: conversation.id,
      senderId: payload.citizenId,
      senderRole: 'warga',
      message: payload.message,
    })
  }

  return {
    conversation,
    initialMessage,
  }
}

async function getMessages(conversationId) {
  const conversation = await conversationModel.findById(conversationId)

  if (!conversation) {
    throw createApiError('Percakapan tidak ditemukan.', 404)
  }

  return conversationModel.findMessages(conversationId)
}

async function addMessage(conversationId, payload) {
  const errors = conversationValidator.validateCreateMessage(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const conversation = await conversationModel.findById(conversationId)

  if (!conversation) {
    throw createApiError('Percakapan tidak ditemukan.', 404)
  }

  const message = await conversationModel.addMessage({
    conversationId,
    senderId: payload.senderId,
    senderRole: payload.senderRole,
    message: payload.message,
  })

  const status = payload.senderRole === 'warga' ? 'waiting_response' : 'answered'
  await conversationModel.updateStatus(conversationId, status)

  return message
}

async function updateStatus(conversationId, status) {
  if (!conversationValidator.isValidStatus(status)) {
    throw createApiError('Status percakapan tidak valid.', 400)
  }

  const conversation = await conversationModel.updateStatus(conversationId, status)

  if (!conversation) {
    throw createApiError('Percakapan tidak ditemukan.', 404)
  }

  return conversation
}

module.exports = {
  getConversations,
  createConversation,
  getMessages,
  addMessage,
  updateStatus,
}

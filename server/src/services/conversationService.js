const conversationModel = require('../models/conversationModel')
const kelurahanModel = require('../models/kelurahanModel')
const createApiError = require('../utils/apiError')
const phoneUtils = require('../utils/phone')
const conversationValidator = require('../validators/conversationValidator')

function isStaff(user) {
  return user && ['admin', 'lurah'].includes(user.role)
}

function getScopedFilters(filters, user) {
  if (!user) {
    throw createApiError('Login terlebih dahulu.', 401)
  }

  if (isStaff(user)) {
    return {
      ...filters,
      kelurahanId: user.kelurahanId,
    }
  }

  return {
    ...filters,
    citizenId: user.id,
  }
}

function ensureCanAccessConversation(conversation, user) {
  if (!user) {
    // Memperbolehkan akses guest jika mereka mengetahui ID percakapan
    return
  }

  if (isStaff(user) && Number(conversation.kelurahanId) === Number(user.kelurahanId)) {
    return
  }

  if (user.role === 'warga' && Number(conversation.citizenId) === Number(user.id)) {
    return
  }

  throw createApiError('Anda tidak memiliki akses ke chat kelurahan lain.', 403)
}

async function getConversations(filters, user) {
  return conversationModel.findAll(getScopedFilters(filters, user))
}

async function getConversationById(id, user) {
  const conversation = await conversationModel.findById(id)

  if (!conversation) {
    throw createApiError('Percakapan tidak ditemukan.', 404)
  }

  ensureCanAccessConversation(conversation, user)

  const messages = await conversationModel.findMessages(id)

  return {
    ...conversation,
    messages,
  }
}

async function createConversation(payload, user) {
  const errors = conversationValidator.validateConversation(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const kelurahanId = payload.kelurahanId || (user && user.kelurahanId)

  if (!kelurahanId) {
    throw createApiError('Kelurahan wajib dipilih.', 400)
  }

  if (isStaff(user) && Number(kelurahanId) !== Number(user.kelurahanId)) {
    throw createApiError('Admin hanya boleh membuat chat untuk kelurahannya sendiri.', 403)
  }

  const conversation = await conversationModel.create({
    ...payload,
    kelurahanId,
    citizenId: payload.citizenId || (user && user.role === 'warga' ? user.id : undefined),
    guestName: !user ? payload.guestName : undefined,
  })

  if (payload.message) {
    const messageErrors = conversationValidator.validateMessage({
      senderId: payload.senderId || conversation.citizenId || (user && user.id),
      senderRole: payload.senderRole || (user && user.role) || 'warga',
      message: payload.message,
    })

    if (messageErrors.length) {
      throw createApiError(messageErrors.join(' '), 400)
    }

    await conversationModel.addMessage({
      conversationId: conversation.id,
      senderId: payload.senderId || conversation.citizenId || (user && user.id),
      guestSenderName: !user ? payload.guestName : undefined,
      senderRole: payload.senderRole || (user && user.role) || 'warga',
      message: payload.message,
    })
  }

  return getConversationById(conversation.id, user)
}

async function updateConversation(id, payload, user) {
  const errors = conversationValidator.validateConversation(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  const conversation = await getConversationById(id, user)

  if (payload.kelurahanId && Number(payload.kelurahanId) !== Number(conversation.kelurahanId)) {
    throw createApiError('Kelurahan chat tidak boleh dipindahkan dari route ini.', 400)
  }

  return conversationModel.update(id, payload)
}

async function deleteConversation(id, user) {
  await getConversationById(id, user)
  await conversationModel.remove(id)
}

async function addMessage(conversationId, payload, user) {
  const messagePayload = {
    ...payload,
    senderId: payload.senderId || (user && user.id),
    senderRole: payload.senderRole || (user && user.role),
  }
  const errors = conversationValidator.validateMessage(messagePayload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getConversationById(conversationId, user)

  const message = await conversationModel.addMessage({
    conversationId,
    senderId: messagePayload.senderId,
    guestSenderName: !user ? payload.guestName : undefined,
    senderRole: messagePayload.senderRole,
    message: messagePayload.message,
  })

  const status = messagePayload.senderRole === 'warga' ? 'waiting_response' : 'answered'
  await conversationModel.update(conversationId, { status })

  return message
}

async function updateMessage(conversationId, messageId, payload, user) {
  const errors = conversationValidator.validateUpdateMessage(payload)

  if (errors.length) {
    throw createApiError(errors.join(' '), 400)
  }

  await getConversationById(conversationId, user)

  const message = await conversationModel.updateMessage(conversationId, messageId, payload)

  if (!message) {
    throw createApiError('Pesan tidak ditemukan.', 404)
  }

  return message
}

async function deleteMessage(conversationId, messageId, user) {
  await getConversationById(conversationId, user)

  const deleted = await conversationModel.removeMessage(conversationId, messageId)

  if (!deleted) {
    throw createApiError('Pesan tidak ditemukan.', 404)
  }
}

async function forwardToLurah(conversationId, payload, user) {
  const conversation = await getConversationById(conversationId, user)
  const kelurahan = await kelurahanModel.findById(conversation.kelurahanId)
  const lurahWhatsappNumber = payload.lurahWhatsappNumber || kelurahan.lurahWhatsappNumber
  const normalizedPhone = phoneUtils.normalizePhoneNumber(lurahWhatsappNumber)

  if (!normalizedPhone) {
    throw createApiError('Nomor WhatsApp lurah belum diisi di data kelurahan.', 400)
  }

  const forwardMessage =
    payload.message ||
    [
      'Assalamualaikum Pak Lurah, mohon tanggapan untuk chat warga.',
      '',
      `Kode chat: CHAT-${conversation.id}`,
      `Kelurahan: ${conversation.kelurahanName || '-'}`,
      `Subjek: ${conversation.subject || '-'}`,
      '',
      'Balas melalui WhatsApp dengan format:',
      `CHAT-${conversation.id}: tulis balasan di sini`,
    ].join('\n')

  await conversationModel.markForwardedToLurah(conversation.id, normalizedPhone)

  return {
    conversationId: conversation.id,
    lurahWhatsappNumber: normalizedPhone,
    whatsappMessage: forwardMessage,
    whatsappUrl: phoneUtils.createWhatsappUrl(normalizedPhone, forwardMessage),
  }
}

async function addLurahWhatsappReply(conversationId, payload) {
  const conversation = await conversationModel.findById(conversationId)

  if (!conversation) {
    throw createApiError('Percakapan tidak ditemukan.', 404)
  }

  const senderPhone = phoneUtils.normalizePhoneNumber(payload.fromPhone)
  const forwardedPhone = phoneUtils.normalizePhoneNumber(conversation.forwardedToLurahPhone)

  if (!forwardedPhone) {
    throw createApiError('Chat belum diteruskan ke nomor WhatsApp lurah.', 400)
  }

  if (!senderPhone) {
    throw createApiError('Nomor pengirim WhatsApp wajib dikirim oleh webhook.', 400)
  }

  if (senderPhone !== forwardedPhone) {
    throw createApiError('Nomor WhatsApp pengirim tidak sesuai dengan nomor lurah tujuan.', 403)
  }

  const message = await conversationModel.addMessage({
    conversationId,
    senderId: null,
    senderRole: 'lurah',
    message: payload.message,
    source: 'whatsapp',
    externalMessageId: payload.messageId,
  })

  await conversationModel.update(conversationId, {
    status: 'answered',
  })

  return message
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
  forwardToLurah,
  addLurahWhatsappReply,
}

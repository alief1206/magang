const aspirationService = require('./aspirationService')
const conversationService = require('./conversationService')
const createApiError = require('../utils/apiError')
const phoneUtils = require('../utils/phone')

function parseLabeledMessage(message) {
  const result = {}
  const fieldMap = {
    nama: 'name',
    alamat: 'address',
    kategori: 'category',
    judul: 'shortTitle',
    deskripsi: 'description',
    kelurahan: 'kelurahanId',
    kelurahanid: 'kelurahanId',
  }

  for (const line of String(message || '').split(/\r?\n/)) {
    const separatorIndex = line.indexOf(':')

    if (separatorIndex === -1) {
      continue
    }

    const rawKey = line.slice(0, separatorIndex).trim().toLowerCase().replace(/\s+/g, '')
    const value = line.slice(separatorIndex + 1).trim()
    const field = fieldMap[rawKey]

    if (field && value) {
      result[field] = value
    }
  }

  return result
}

function extractConversationReply(payload) {
  const message = String(payload.message || '')
  const match = message.match(/CHAT-(\d+)\s*:?\s*([\s\S]*)/i)

  if (!payload.conversationId && !match) {
    throw createApiError('Kode chat tidak ditemukan. Gunakan format CHAT-1: balasan.', 400)
  }

  return {
    conversationId: payload.conversationId || match[1],
    message: payload.reply || (match ? match[2].trim() : message.trim()),
  }
}

async function receiveAspiration(payload) {
  const parsedMessage = parseLabeledMessage(payload.message)
  const aspirationPayload = {
    ...parsedMessage,
    ...payload,
    name: payload.name || parsedMessage.name || payload.fromName,
    category: payload.category || parsedMessage.category || 'whatsapp',
    shortTitle:
      payload.shortTitle ||
      parsedMessage.shortTitle ||
      String(payload.message || '').slice(0, 100) ||
      'Aspirasi dari WhatsApp',
    description: payload.description || parsedMessage.description || payload.message,
    whatsappSenderPhone: phoneUtils.normalizePhoneNumber(payload.fromPhone),
    whatsappMessageId: payload.messageId,
    source: 'whatsapp',
  }

  return aspirationService.createAspiration(aspirationPayload, null)
}

async function receiveChatReply(payload) {
  const reply = extractConversationReply(payload)

  if (!reply.message) {
    throw createApiError('Balasan WhatsApp tidak boleh kosong.', 400)
  }

  return conversationService.addLurahWhatsappReply(reply.conversationId, {
    fromPhone: payload.fromPhone,
    message: reply.message,
    messageId: payload.messageId,
  })
}

module.exports = {
  receiveAspiration,
  receiveChatReply,
}

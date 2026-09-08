const db = require('../config/database')
const encryption = require('../utils/encryption')
const { buildUpdateQuery } = require('../utils/queryBuilder')

const conversationEncryptedFields = ['subject', 'citizenName', 'forwardedToLurahPhone']
const messageEncryptedFields = ['message', 'senderName']

async function findAll(filters = {}) {
  const where = ['c.is_deleted = FALSE']
  const params = []

  if (filters.status) {
    where.push('c.status = ?')
    params.push(filters.status)
  }

  if (filters.targetRole) {
    where.push('c.target_role = ?')
    params.push(filters.targetRole)
  }

  if (filters.citizenId) {
    where.push('c.citizen_id = ?')
    params.push(filters.citizenId)
  }

  if (filters.kelurahanId) {
    where.push('c.kelurahan_id = ?')
    params.push(filters.kelurahanId)
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await db.query(
    `
      SELECT
        c.id,
        c.kelurahan_id AS kelurahanId,
        k.name AS kelurahanName,
        c.citizen_id AS citizenId,
        COALESCE(u.name, c.guest_name) AS citizenName,
        c.target_role AS targetRole,
        c.status,
        c.subject,
        c.forwarded_to_lurah_phone AS forwardedToLurahPhone,
        c.forwarded_to_lurah_at AS forwardedToLurahAt,
        c.last_message_at AS lastMessageAt,
        c.created_at AS createdAt,
        c.updated_at AS updatedAt
      FROM chat_conversations c
      LEFT JOIN kelurahans k ON k.id = c.kelurahan_id
      LEFT JOIN users u ON u.id = c.citizen_id
      ${whereClause}
      ORDER BY COALESCE(c.last_message_at, c.created_at) DESC
    `,
    params,
  )

  return encryption.decryptRows(rows, conversationEncryptedFields)
}

async function findById(id) {
  const [rows] = await db.query(
    `
      SELECT
        c.id,
        c.kelurahan_id AS kelurahanId,
        k.name AS kelurahanName,
        c.citizen_id AS citizenId,
        COALESCE(u.name, c.guest_name) AS citizenName,
        c.target_role AS targetRole,
        c.status,
        c.subject,
        c.forwarded_to_lurah_phone AS forwardedToLurahPhone,
        c.forwarded_to_lurah_at AS forwardedToLurahAt,
        c.last_message_at AS lastMessageAt,
        c.created_at AS createdAt,
        c.updated_at AS updatedAt
      FROM chat_conversations c
      LEFT JOIN kelurahans k ON k.id = c.kelurahan_id
      LEFT JOIN users u ON u.id = c.citizen_id
      WHERE c.id = ? AND c.is_deleted = FALSE
    `,
    [id],
  )

  return encryption.decryptFields(rows[0] || null, conversationEncryptedFields)
}

async function create(conversation) {
  const encryptedSubject = encryption.encryptText(conversation.subject)
  const [result] = await db.query(
    `
      INSERT INTO chat_conversations (kelurahan_id, citizen_id, guest_name, target_role, status, subject)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      conversation.kelurahanId || null,
      conversation.citizenId || null,
      conversation.guestName || null,
      conversation.targetRole || 'admin',
      conversation.status || 'waiting_response',
      encryptedSubject || null,
    ],
  )

  return findById(result.insertId)
}

async function update(id, conversation) {
  const query = buildUpdateQuery(
    'chat_conversations',
    {
      kelurahan_id: conversation.kelurahanId,
      citizen_id: conversation.citizenId,
      target_role: conversation.targetRole,
      status: conversation.status,
      subject: encryption.encryptText(conversation.subject),
      forwarded_to_lurah_phone: encryption.encryptText(conversation.forwardedToLurahPhone),
      forwarded_to_lurah_at: conversation.forwardedToLurahAt,
    },
    id,
  )

  if (query) {
    await db.query(query.sql, query.values)
  }

  return findById(id)
}

async function remove(id) {
  const [result] = await db.query("UPDATE chat_conversations SET is_deleted = TRUE, status = 'closed' WHERE id = ?", [id])
  return result.affectedRows > 0
}

async function addMessage(message) {
  const encryptedMessage = encryption.encryptText(message.message)
  const [result] = await db.query(
    `
      INSERT INTO chat_messages (
        conversation_id,
        sender_id,
        guest_sender_name,
        sender_role,
        message,
        source,
        external_message_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      message.conversationId,
      message.senderId || null,
      message.guestSenderName || null,
      message.senderRole,
      encryptedMessage,
      message.source || 'web',
      message.externalMessageId || null,
    ],
  )

  await db.query('UPDATE chat_conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?', [
    message.conversationId,
  ])

  return findMessageById(result.insertId)
}

async function findMessages(conversationId) {
  const [rows] = await db.query(
    `
      SELECT
        m.id,
        m.conversation_id AS conversationId,
        m.sender_id AS senderId,
        COALESCE(u.name, m.guest_sender_name) AS senderName,
        m.sender_role AS senderRole,
        m.message,
        m.source,
        m.external_message_id AS externalMessageId,
        m.is_read AS isRead,
        m.created_at AS createdAt,
        m.updated_at AS updatedAt
      FROM chat_messages m
      LEFT JOIN users u ON u.id = m.sender_id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `,
    [conversationId],
  )

  return encryption.decryptRows(rows, messageEncryptedFields)
}

async function findMessageById(id) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        conversation_id AS conversationId,
        sender_id AS senderId,
        sender_role AS senderRole,
        message,
        source,
        external_message_id AS externalMessageId,
        is_read AS isRead,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM chat_messages
      WHERE id = ?
    `,
    [id],
  )

  return encryption.decryptFields(rows[0] || null, messageEncryptedFields)
}

async function updateMessage(conversationId, messageId, payload) {
  const [result] = await db.query(
    'UPDATE chat_messages SET message = ?, is_read = COALESCE(?, is_read) WHERE id = ? AND conversation_id = ?',
    [encryption.encryptText(payload.message), payload.isRead ?? null, messageId, conversationId],
  )

  if (!result.affectedRows) {
    return null
  }

  return findMessageById(messageId)
}

async function removeMessage(conversationId, messageId) {
  const [result] = await db.query('DELETE FROM chat_messages WHERE id = ? AND conversation_id = ?', [
    messageId,
    conversationId,
  ])

  return result.affectedRows > 0
}

async function markForwardedToLurah(id, phone) {
  await db.query(
    `
      UPDATE chat_conversations
      SET forwarded_to_lurah_phone = ?,
          forwarded_to_lurah_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    [encryption.encryptText(phone), id],
  )

  return findById(id)
}

async function markMessagesAsRead(conversationId, userRole) {
  let condition = ""
  
  if (userRole === 'admin' || userRole === 'lurah') {
    condition = "sender_role = 'warga'"
  } else {
    condition = "sender_role IN ('admin', 'lurah')"
  }
  
  await db.query(
    `UPDATE chat_messages SET is_read = 1 WHERE conversation_id = ? AND ${condition} AND is_read = 0`,
    [conversationId]
  )
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  addMessage,
  findMessages,
  findMessageById,
  updateMessage,
  removeMessage,
  markForwardedToLurah,
  markMessagesAsRead,
}

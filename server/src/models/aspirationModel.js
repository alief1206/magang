const db = require('../config/database')
const encryption = require('../utils/encryption')
const { buildUpdateQuery } = require('../utils/queryBuilder')

const aspirationEncryptedFields = [
  'name',
  'address',
  'shortTitle',
  'description',
  'whatsappSenderPhone',
]
const responseEncryptedFields = ['response', 'responderName']

function decryptAspiration(aspiration) {
  return encryption.decryptFields(aspiration, aspirationEncryptedFields)
}

function decryptResponse(response) {
  return encryption.decryptFields(response, responseEncryptedFields)
}

async function findAll(filters = {}) {
  const where = ['a.is_deleted = FALSE']
  const params = []

  if (filters.status) {
    where.push('a.status = ?')
    params.push(filters.status)
  }

  if (filters.category) {
    where.push('a.category = ?')
    params.push(filters.category)
  }

  if (filters.assignedToRole) {
    where.push('a.assigned_to_role = ?')
    params.push(filters.assignedToRole)
  }

  if (filters.kelurahanId) {
    where.push('a.kelurahan_id = ?')
    params.push(filters.kelurahanId)
  }

  if (filters.userId) {
    where.push('a.user_id = ?')
    params.push(filters.userId)
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await db.query(
    `
      SELECT
        a.id,
        a.kelurahan_id AS kelurahanId,
        k.name AS kelurahanName,
        a.user_id AS userId,
        a.name,
        a.address,
        a.category,
        a.short_title AS shortTitle,
        a.description,
        a.image_path AS imagePath,
        a.compressed_image_path AS compressedImagePath,
        a.compression_status AS compressionStatus,
        a.source,
        a.whatsapp_sender_phone AS whatsappSenderPhone,
        a.whatsapp_message_id AS whatsappMessageId,
        a.status,
        a.assigned_to_role AS assignedToRole,
        a.created_at AS createdAt,
        a.updated_at AS updatedAt
      FROM citizen_aspirations a
      LEFT JOIN kelurahans k ON k.id = a.kelurahan_id
      ${whereClause}
      ORDER BY a.created_at DESC
    `,
    params,
  )

  return encryption.decryptRows(rows, aspirationEncryptedFields)
}

async function findById(id) {
  const [rows] = await db.query(
    `
      SELECT
        a.id,
        a.kelurahan_id AS kelurahanId,
        k.name AS kelurahanName,
        a.user_id AS userId,
        a.name,
        a.address,
        a.category,
        a.short_title AS shortTitle,
        a.description,
        a.image_path AS imagePath,
        a.image_original_name AS imageOriginalName,
        a.image_mime_type AS imageMimeType,
        a.image_size_bytes AS imageSizeBytes,
        a.compressed_image_path AS compressedImagePath,
        a.compressed_image_size_bytes AS compressedImageSizeBytes,
        a.compression_status AS compressionStatus,
        a.source,
        a.whatsapp_sender_phone AS whatsappSenderPhone,
        a.whatsapp_message_id AS whatsappMessageId,
        a.status,
        a.assigned_to_role AS assignedToRole,
        a.created_at AS createdAt,
        a.updated_at AS updatedAt
      FROM citizen_aspirations a
      LEFT JOIN kelurahans k ON k.id = a.kelurahan_id
      WHERE a.id = ? AND a.is_deleted = FALSE
    `,
    [id],
  )

  return decryptAspiration(rows[0] || null)
}

async function create(aspiration) {
  const encryptedAspiration = encryption.encryptFields(aspiration, aspirationEncryptedFields)
  const [result] = await db.query(
    `
      INSERT INTO citizen_aspirations (
        user_id,
        kelurahan_id,
        name,
        address,
        category,
        short_title,
        description,
        image_path,
        image_original_name,
        image_mime_type,
        image_size_bytes,
        compressed_image_path,
        compressed_image_size_bytes,
        compression_status,
        source,
        whatsapp_sender_phone,
        whatsapp_message_id,
        status,
        assigned_to_role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      aspiration.userId || null,
      aspiration.kelurahanId || null,
      encryptedAspiration.name,
      encryptedAspiration.address,
      aspiration.category,
      encryptedAspiration.shortTitle,
      encryptedAspiration.description,
      aspiration.imagePath || null,
      aspiration.imageOriginalName || null,
      aspiration.imageMimeType || null,
      aspiration.imageSizeBytes || null,
      aspiration.compressedImagePath || null,
      aspiration.compressedImageSizeBytes || null,
      aspiration.compressionStatus || 'not_needed',
      aspiration.source || 'web',
      encryptedAspiration.whatsappSenderPhone || null,
      aspiration.whatsappMessageId || null,
      aspiration.status || 'baru',
      aspiration.assignedToRole || 'admin',
    ],
  )

  return findById(result.insertId)
}

async function update(id, aspiration) {
  const query = buildUpdateQuery(
    'citizen_aspirations',
    {
      user_id: aspiration.userId,
      kelurahan_id: aspiration.kelurahanId,
      name: encryption.encryptText(aspiration.name),
      address: encryption.encryptText(aspiration.address),
      category: aspiration.category,
      short_title: encryption.encryptText(aspiration.shortTitle),
      description: encryption.encryptText(aspiration.description),
      image_path: aspiration.imagePath,
      image_original_name: aspiration.imageOriginalName,
      image_mime_type: aspiration.imageMimeType,
      image_size_bytes: aspiration.imageSizeBytes,
      compressed_image_path: aspiration.compressedImagePath,
      compressed_image_size_bytes: aspiration.compressedImageSizeBytes,
      compression_status: aspiration.compressionStatus,
      source: aspiration.source,
      whatsapp_sender_phone: encryption.encryptText(aspiration.whatsappSenderPhone),
      whatsapp_message_id: aspiration.whatsappMessageId,
      status: aspiration.status,
      assigned_to_role: aspiration.assignedToRole,
    },
    id,
  )

  if (query) {
    await db.query(query.sql, query.values)
  }

  return findById(id)
}

async function remove(id) {
  const [result] = await db.query("UPDATE citizen_aspirations SET is_deleted = TRUE, status = 'selesai' WHERE id = ?", [id])
  return result.affectedRows > 0
}

async function forwardToLurah({ aspirationId, kelurahanId, forwardedBy }) {
  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()
    await connection.query(
      `UPDATE citizen_aspirations
       SET status = 'diteruskan_ke_lurah', assigned_to_role = 'lurah'
       WHERE id = ?`,
      [aspirationId],
    )
    await connection.query(
      `INSERT INTO aspiration_forwarding_histories (aspiration_id, forwarded_by, recipient_role)
       VALUES (?, ?, 'lurah')`,
      [aspirationId, forwardedBy],
    )
    await connection.query(
      `INSERT INTO aspiration_notifications (aspiration_id, kelurahan_id, recipient_role, message)
       VALUES (?, ?, 'lurah', 'Aspirasi baru telah diteruskan oleh Admin.')`,
      [aspirationId, kelurahanId],
    )
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }

  return findById(aspirationId)
}

async function findNotificationsForLurah(kelurahanId) {
  const [rows] = await db.query(
    `SELECT
       id,
       aspiration_id AS aspirationId,
       message,
       is_read AS isRead,
       created_at AS createdAt
     FROM aspiration_notifications
     WHERE kelurahan_id = ? AND recipient_role = 'lurah'
     ORDER BY created_at DESC`,
    [kelurahanId],
  )

  return rows
}

async function findResponses(aspirationId) {
  const [rows] = await db.query(
    `
      SELECT
        r.id,
        r.aspiration_id AS aspirationId,
        r.responder_id AS responderId,
        u.name AS responderName,
        r.responder_role AS responderRole,
        r.response,
        r.source,
        r.external_message_id AS externalMessageId,
        r.created_at AS createdAt,
        r.updated_at AS updatedAt
      FROM aspiration_responses r
      LEFT JOIN users u ON u.id = r.responder_id
      WHERE r.aspiration_id = ?
      ORDER BY r.created_at ASC
    `,
    [aspirationId],
  )

  return encryption.decryptRows(rows, responseEncryptedFields)
}

async function findResponseById(id) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        aspiration_id AS aspirationId,
        responder_id AS responderId,
        responder_role AS responderRole,
        response,
        source,
        external_message_id AS externalMessageId,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM aspiration_responses
      WHERE id = ?
    `,
    [id],
  )

  return decryptResponse(rows[0] || null)
}

async function addResponse(response) {
  const encryptedResponse = encryption.encryptFields(response, responseEncryptedFields)
  const [result] = await db.query(
    `
      INSERT INTO aspiration_responses (
        aspiration_id,
        responder_id,
        responder_role,
        response,
        source,
        external_message_id
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      response.aspirationId,
      response.responderId || null,
      response.responderRole,
      encryptedResponse.response,
      response.source || 'web',
      response.externalMessageId || null,
    ],
  )

  await db.query('UPDATE citizen_aspirations SET status = ? WHERE id = ?', [
    'ditanggapi',
    response.aspirationId,
  ])

  return findResponseById(result.insertId)
}

async function updateResponse(aspirationId, responseId, payload) {
  const encryptedPayload = encryption.encryptFields(payload, responseEncryptedFields)
  const [result] = await db.query(
    `
      UPDATE aspiration_responses
      SET responder_id = COALESCE(?, responder_id),
          responder_role = COALESCE(?, responder_role),
          response = ?,
          source = COALESCE(?, source),
          external_message_id = COALESCE(?, external_message_id)
      WHERE id = ? AND aspiration_id = ?
    `,
    [
      payload.responderId ?? null,
      payload.responderRole ?? null,
      encryptedPayload.response,
      payload.source ?? null,
      payload.externalMessageId ?? null,
      responseId,
      aspirationId,
    ],
  )

  if (!result.affectedRows) {
    return null
  }

  return findResponseById(responseId)
}

async function removeResponse(aspirationId, responseId) {
  const [result] = await db.query(
    'DELETE FROM aspiration_responses WHERE id = ? AND aspiration_id = ?',
    [responseId, aspirationId],
  )

  return result.affectedRows > 0
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  forwardToLurah,
  findNotificationsForLurah,
  findResponses,
  addResponse,
  updateResponse,
  removeResponse,
}

const db = require('../config/database')

async function findAll(filters = {}) {
  const where = []
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

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : ''

  const [rows] = await db.query(
    `
      SELECT
        a.id,
        a.user_id AS userId,
        a.name,
        a.address,
        a.category,
        a.short_title AS shortTitle,
        a.description,
        a.image_path AS imagePath,
        a.compressed_image_path AS compressedImagePath,
        a.compression_status AS compressionStatus,
        a.status,
        a.assigned_to_role AS assignedToRole,
        a.created_at AS createdAt,
        a.updated_at AS updatedAt
      FROM citizen_aspirations a
      ${whereClause}
      ORDER BY a.created_at DESC
    `,
    params,
  )

  return rows
}

async function findById(id) {
  const [rows] = await db.query(
    `
      SELECT
        a.id,
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
        a.status,
        a.assigned_to_role AS assignedToRole,
        a.created_at AS createdAt,
        a.updated_at AS updatedAt
      FROM citizen_aspirations a
      WHERE a.id = ?
    `,
    [id],
  )

  return rows[0] || null
}

async function create(aspiration) {
  const [result] = await db.query(
    `
      INSERT INTO citizen_aspirations (
        user_id,
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
        assigned_to_role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      aspiration.userId || null,
      aspiration.name,
      aspiration.address,
      aspiration.category,
      aspiration.shortTitle,
      aspiration.description,
      aspiration.imagePath || null,
      aspiration.imageOriginalName || null,
      aspiration.imageMimeType || null,
      aspiration.imageSizeBytes || null,
      aspiration.compressedImagePath || null,
      aspiration.compressedImageSizeBytes || null,
      aspiration.compressionStatus || 'pending',
      aspiration.assignedToRole || 'admin',
    ],
  )

  return findById(result.insertId)
}

async function updateStatus(id, status) {
  await db.query('UPDATE citizen_aspirations SET status = ? WHERE id = ?', [status, id])
  return findById(id)
}

async function addResponse(response) {
  const [result] = await db.query(
    `
      INSERT INTO aspiration_responses (aspiration_id, responder_id, responder_role, response)
      VALUES (?, ?, ?, ?)
    `,
    [response.aspirationId, response.responderId || null, response.responderRole, response.response],
  )

  await db.query('UPDATE citizen_aspirations SET status = ? WHERE id = ?', [
    'ditanggapi',
    response.aspirationId,
  ])

  return findResponseById(result.insertId)
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
        r.created_at AS createdAt
      FROM aspiration_responses r
      LEFT JOIN users u ON u.id = r.responder_id
      WHERE r.aspiration_id = ?
      ORDER BY r.created_at ASC
    `,
    [aspirationId],
  )

  return rows
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
        created_at AS createdAt
      FROM aspiration_responses
      WHERE id = ?
    `,
    [id],
  )

  return rows[0] || null
}

module.exports = {
  findAll,
  findById,
  create,
  updateStatus,
  addResponse,
  findResponses,
}

const db = require('../config/database')
const encryption = require('../utils/encryption')
const { buildUpdateQuery } = require('../utils/queryBuilder')

const encryptedFields = ['lurahName', 'lurahWhatsappNumber']

async function findAll() {
  const [rows] = await db.query(
    `
      SELECT
        id,
        name,
        code,
        lurah_name AS lurahName,
        lurah_whatsapp_number AS lurahWhatsappNumber,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM kelurahans
      ORDER BY name ASC
    `,
  )

  return encryption.decryptRows(rows, encryptedFields)
}

async function findById(id) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        name,
        code,
        lurah_name AS lurahName,
        lurah_whatsapp_number AS lurahWhatsappNumber,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM kelurahans
      WHERE id = ?
    `,
    [id],
  )

  return encryption.decryptFields(rows[0] || null, encryptedFields)
}

async function create(kelurahan) {
  const encryptedKelurahan = encryption.encryptFields(kelurahan, encryptedFields)
  const [result] = await db.query(
    `
      INSERT INTO kelurahans (name, code, lurah_name, lurah_whatsapp_number)
      VALUES (?, ?, ?, ?)
    `,
    [
      kelurahan.name,
      kelurahan.code || null,
      encryptedKelurahan.lurahName || null,
      encryptedKelurahan.lurahWhatsappNumber || null,
    ],
  )

  return findById(result.insertId)
}

async function update(id, kelurahan) {
  const query = buildUpdateQuery(
    'kelurahans',
    {
      name: kelurahan.name,
      code: kelurahan.code,
      lurah_name: encryption.encryptText(kelurahan.lurahName),
      lurah_whatsapp_number: encryption.encryptText(kelurahan.lurahWhatsappNumber),
    },
    id,
  )

  if (query) {
    await db.query(query.sql, query.values)
  }

  return findById(id)
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM kelurahans WHERE id = ?', [id])
  return result.affectedRows > 0
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
}

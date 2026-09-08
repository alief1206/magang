const db = require('../config/database')
const encryption = require('../utils/encryption')
const { buildUpdateQuery } = require('../utils/queryBuilder')

const encryptedFields = ['name', 'address', 'phone']

function decryptUser(user) {
  return encryption.decryptFields(user, encryptedFields)
}

async function findAll() {
  const [rows] = await db.query(
    `
      SELECT
        u.id,
        u.kelurahan_id AS kelurahanId,
        k.name AS kelurahanName,
        u.name,
        u.email,
        u.role,
        u.address,
        u.phone,
        u.created_at AS createdAt,
        u.updated_at AS updatedAt
      FROM users u
      LEFT JOIN kelurahans k ON k.id = u.kelurahan_id
      ORDER BY u.id DESC
    `,
  )

  return encryption.decryptRows(rows, encryptedFields)
}

async function findById(id) {
  const [rows] = await db.query(
    `
      SELECT
        u.id,
        u.kelurahan_id AS kelurahanId,
        k.name AS kelurahanName,
        u.name,
        u.email,
        u.role,
        u.address,
        u.phone,
        u.created_at AS createdAt,
        u.updated_at AS updatedAt
      FROM users u
      LEFT JOIN kelurahans k ON k.id = u.kelurahan_id
      WHERE u.id = ?
    `,
    [id],
  )

  return decryptUser(rows[0] || null)
}

async function findByEmailForAuth(email) {
  const [rows] = await db.query(
    `
      SELECT
        u.id,
        u.kelurahan_id AS kelurahanId,
        k.name AS kelurahanName,
        u.name,
        u.email,
        u.password,
        u.role,
        u.address,
        u.phone,
        u.created_at AS createdAt,
        u.updated_at AS updatedAt
      FROM users u
      LEFT JOIN kelurahans k ON k.id = u.kelurahan_id
      WHERE u.email = ?
    `,
    [email],
  )

  return decryptUser(rows[0] || null)
}

async function create(user) {
  const encryptedUser = encryption.encryptFields(user, encryptedFields)
  const [result] = await db.query(
    `
      INSERT INTO users (kelurahan_id, name, email, password, role, address, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      user.kelurahanId || null,
      encryptedUser.name,
      user.email,
      user.password,
      user.role || 'warga',
      encryptedUser.address || null,
      encryptedUser.phone || null,
    ],
  )

  return findById(result.insertId)
}

async function update(id, user) {
  const encryptedUser = encryption.encryptFields(user, encryptedFields)
  const query = buildUpdateQuery(
    'users',
    {
      kelurahan_id: user.kelurahanId,
      name: encryptedUser.name,
      email: user.email,
      password: user.password,
      role: user.role,
      address: encryptedUser.address,
      phone: encryptedUser.phone,
    },
    id,
  )

  if (query) {
    await db.query(query.sql, query.values)
  }

  return findById(id)
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id])
  return result.affectedRows > 0
}

module.exports = {
  findAll,
  findById,
  findByEmailForAuth,
  create,
  update,
  remove,
}

const db = require('../config/database')
const { buildUpdateQuery } = require('../utils/queryBuilder')

async function findAll() {
  const [rows] = await db.query(
    'SELECT id, name, email, role, address, phone, created_at AS createdAt, updated_at AS updatedAt FROM users ORDER BY id DESC',
  )

  return rows
}

async function findById(id) {
  const [rows] = await db.query(
    'SELECT id, name, email, role, address, phone, created_at AS createdAt, updated_at AS updatedAt FROM users WHERE id = ?',
    [id],
  )

  return rows[0] || null
}

async function create(user) {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password, role, address, phone) VALUES (?, ?, ?, ?, ?, ?)',
    [
      user.name,
      user.email,
      user.password,
      user.role || 'warga',
      user.address || null,
      user.phone || null,
    ],
  )

  return findById(result.insertId)
}

async function update(id, user) {
  const query = buildUpdateQuery(
    'users',
    {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      address: user.address,
      phone: user.phone,
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
  create,
  update,
  remove,
}

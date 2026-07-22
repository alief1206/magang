const db = require('../config/database')

async function findAll() {
  const [rows] = await db.query(
    'SELECT id, name, email, role, address, phone, created_at FROM users ORDER BY id DESC',
  )
  return rows
}

async function findById(id) {
  const [rows] = await db.query(
    'SELECT id, name, email, role, address, phone, created_at FROM users WHERE id = ?',
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

  return {
    id: result.insertId,
    ...user,
  }
}

module.exports = {
  findAll,
  findById,
  create,
}

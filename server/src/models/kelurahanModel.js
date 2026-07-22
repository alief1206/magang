const db = require('../config/database')
const { buildUpdateQuery } = require('../utils/queryBuilder')

async function findAll() {
  const [rows] = await db.query(
    'SELECT id, name, code, created_at AS createdAt, updated_at AS updatedAt FROM kelurahans ORDER BY name ASC',
  )

  return rows
}

async function findById(id) {
  const [rows] = await db.query(
    'SELECT id, name, code, created_at AS createdAt, updated_at AS updatedAt FROM kelurahans WHERE id = ?',
    [id],
  )

  return rows[0] || null
}

async function create(kelurahan) {
  const [result] = await db.query('INSERT INTO kelurahans (name, code) VALUES (?, ?)', [
    kelurahan.name,
    kelurahan.code || null,
  ])

  return findById(result.insertId)
}

async function update(id, kelurahan) {
  const query = buildUpdateQuery(
    'kelurahans',
    {
      name: kelurahan.name,
      code: kelurahan.code,
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

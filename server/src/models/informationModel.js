const db = require('../config/database');

async function findAll(kelurahanId) {
  let query = `
    SELECT
      i.id,
      i.kelurahan_id AS kelurahanId,
      i.author_id AS authorId,
      u.name AS authorName,
      i.title,
      i.type,
      i.event_date AS eventDate,
      i.description,
      i.image_url AS imageUrl,
      i.created_at AS createdAt,
      i.updated_at AS updatedAt
    FROM informations i
    LEFT JOIN users u ON i.author_id = u.id
  `;
  const params = [];

  if (kelurahanId) {
    query += ` WHERE i.kelurahan_id = ?`;
    params.push(kelurahanId);
  }

  query += ` ORDER BY i.created_at DESC`;

  const [rows] = await db.query(query, params);
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(
    `
      SELECT
        i.id,
        i.kelurahan_id AS kelurahanId,
        i.author_id AS authorId,
        u.name AS authorName,
        i.title,
        i.type,
        i.event_date AS eventDate,
        i.description,
        i.image_url AS imageUrl,
        i.created_at AS createdAt,
        i.updated_at AS updatedAt
      FROM informations i
      LEFT JOIN users u ON i.author_id = u.id
      WHERE i.id = ?
    `,
    [id]
  );
  return rows[0] || null;
}

async function create(data) {
  const [result] = await db.query(
    `
      INSERT INTO informations (kelurahan_id, author_id, title, type, event_date, description, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.kelurahanId,
      data.authorId,
      data.title,
      data.type || 'Pengumuman',
      data.eventDate || null,
      data.description,
      data.imageUrl || null
    ]
  );
  return findById(result.insertId);
}

async function remove(id) {
  const [result] = await db.query('DELETE FROM informations WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  remove,
};

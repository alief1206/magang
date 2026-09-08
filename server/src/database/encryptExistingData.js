const db = require('../config/database')
const encryption = require('../utils/encryption')

function needsEncryption(value) {
  return value !== null && value !== undefined && value !== '' && !String(value).startsWith('enc:v1:')
}

async function encryptTable({ table, idColumn = 'id', fields }) {
  const [rows] = await db.query(`SELECT ${idColumn}, ${fields.join(', ')} FROM ${table}`)
  let updatedCount = 0

  for (const row of rows) {
    const updates = {}

    for (const field of fields) {
      if (needsEncryption(row[field])) {
        updates[field] = encryption.encryptText(row[field])
      }
    }

    const updateFields = Object.keys(updates)

    if (!updateFields.length) {
      continue
    }

    const setClause = updateFields.map((field) => `${field} = ?`).join(', ')
    const values = updateFields.map((field) => updates[field])

    await db.query(`UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`, [
      ...values,
      row[idColumn],
    ])
    updatedCount += 1
  }

  console.log(`${table}: ${updatedCount} baris dienkripsi.`)
}

async function run() {
  await encryptTable({
    table: 'users',
    fields: ['name', 'address', 'phone'],
  })
  await encryptTable({
    table: 'kelurahans',
    fields: ['lurah_name', 'lurah_whatsapp_number'],
  })
  await encryptTable({
    table: 'chat_conversations',
    fields: ['subject', 'forwarded_to_lurah_phone'],
  })
  await encryptTable({
    table: 'chat_messages',
    fields: ['message'],
  })
  await encryptTable({
    table: 'citizen_aspirations',
    fields: ['name', 'address', 'short_title', 'description', 'whatsapp_sender_phone'],
  })
  await encryptTable({
    table: 'aspiration_responses',
    fields: ['response'],
  })

  await db.end()
  console.log('Enkripsi data lama selesai.')
}

run().catch(async (error) => {
  console.error(error.code || error.message || error)
  await db.end()
  process.exit(1)
})

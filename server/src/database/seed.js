const db = require('../config/database')
const encryption = require('../utils/encryption')
const bcrypt = require('bcryptjs')

const KELURAHAN_LIST = [
  'Pakis',
  'Sumberrejo',
  'Sobo',
  'Kebalenan',
  'Tamanbaru',
  'Kertosari',
  'Karangrejo',
  'Panderejo',
  'Penganjuran',
  'Tukangkayu',
  'Singonegaran',
  'Singotrunan',
  'Pengantigan',
  'Lateng',
  'Temenggungan',
  'Kampungmelayu',
  'Kampungmandar',
  'Kepatihan',
  'Boyolangu',
  'Giri',
  'Mojopanggung',
  'Penataban',
  'Bakungan',
  'Banjarsari',
  'Kalipuro',
  'Klatak',
  'Gombengsari',
  'Bulusan',
]

const DEFAULT_PASSWORD = 'Kelurahan123!'
const ROLES = ['admin', 'lurah']

async function seedDatabase() {
  console.log('--- Memulai Database Seeding ---')

  // Hash password default dengan bcrypt (salt round 10)
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

  let totalKelurahanInserted = 0
  let totalUsersInserted = 0

  for (const kelurahanName of KELURAHAN_LIST) {
    // 1. Logika FindOrCreate / Upsert untuk Kelurahan
    const [existingKelurahan] = await db.query(
      'SELECT id FROM kelurahans WHERE name = ?',
      [kelurahanName]
    )

    let kelurahanId
    if (existingKelurahan.length > 0) {
      kelurahanId = existingKelurahan[0].id
    } else {
      const [insertResult] = await db.query(
        'INSERT INTO kelurahans (name) VALUES (?)',
        [kelurahanName]
      )
      kelurahanId = insertResult.insertId
      totalKelurahanInserted++
    }

    // Standardisasi nama kelurahan (huruf kecil, tanpa spasi)
    const cleanKelurahanName = kelurahanName.toLowerCase().replace(/\s+/g, '')

    // 2. Logika FindOrCreate / Upsert untuk 2 Akun (Admin & Lurah) per Kelurahan
    for (const role of ROLES) {
      const username = `${role}_${cleanKelurahanName}`
      const displayName = `${role.charAt(0).toUpperCase() + role.slice(1)} ${kelurahanName}`
      const encryptedName = encryption.encryptText(displayName)

      const [existingUser] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [username]
      )

      if (existingUser.length > 0) {
        await db.query(
          `UPDATE users 
           SET kelurahan_id = ?, name = ?, password = ?, role = ? 
           WHERE email = ?`,
          [kelurahanId, encryptedName, hashedPassword, role, username]
        )
      } else {
        await db.query(
          `INSERT INTO users (kelurahan_id, name, email, password, role) 
           VALUES (?, ?, ?, ?, ?)`,
          [kelurahanId, encryptedName, username, hashedPassword, role]
        )
        totalUsersInserted++
      }
    }
  }

  console.log(`✅ Seeding Selesai!`)
  console.log(`- Data Kelurahan diproses: ${KELURAHAN_LIST.length} (Baru dimasukkan: ${totalKelurahanInserted})`)
  console.log(`- Data Akun User diproses: ${KELURAHAN_LIST.length * 2} (Baru dibuat: ${totalUsersInserted})`)
  console.log(`- Password default semua akun: ${DEFAULT_PASSWORD}`)

  await db.end()
}

seedDatabase().catch(async (error) => {
  console.error('❌ Terjadi kesalahan saat seeding database:', error.message || error)
  try {
    await db.end()
  } catch (_) {}
  process.exit(1)
})

const fs = require('fs/promises')
const path = require('path')
const mysql = require('mysql2/promise')
const env = require('../config/env')

function escapeDatabaseName(databaseName) {
  if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
    throw new Error('DB_NAME hanya boleh berisi huruf, angka, dan underscore.')
  }

  return `\`${databaseName}\``
}

async function runMigrations() {
  if (!env.database.name) {
    throw new Error('Isi DB_NAME di file .env terlebih dahulu.')
  }

  const connection = await mysql.createConnection({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    multipleStatements: true,
  })

  const databaseName = escapeDatabaseName(env.database.name)
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS ${databaseName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  )
  await connection.query(`USE ${databaseName}`)

  const migrationsPath = path.join(__dirname, 'migrations')
  const migrationFiles = (await fs.readdir(migrationsPath))
    .filter((file) => file.endsWith('.sql'))
    .sort()

  for (const file of migrationFiles) {
    const sql = await fs.readFile(path.join(migrationsPath, file), 'utf8')
    await connection.query(sql)
    console.log(`Migrated: ${file}`)
  }

  await connection.end()
  console.log('Database migration selesai.')
}

runMigrations().catch((error) => {
  console.error(error.code || error.message || error)
  process.exit(1)
})

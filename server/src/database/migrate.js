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
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) PRIMARY KEY,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const migrationsPath = path.join(__dirname, 'migrations')
  const migrationFiles = (await fs.readdir(migrationsPath))
    .filter((file) => file.endsWith('.sql'))
    .sort()
  const [appliedRows] = await connection.query('SELECT name FROM schema_migrations')
  const appliedMigrations = new Set(appliedRows.map((row) => row.name))

  for (const file of migrationFiles) {
    if (appliedMigrations.has(file)) {
      console.log(`Skipped: ${file}`)
      continue
    }

    const sql = await fs.readFile(path.join(migrationsPath, file), 'utf8')
    await connection.query(sql)
    await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file])
    console.log(`Migrated: ${file}`)
  }

  await connection.end()
  console.log('Database migration selesai.')
}

runMigrations().catch((error) => {
  console.error(error.code || error.message || error)
  process.exit(1)
})

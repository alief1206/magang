const crypto = require('crypto')
const { promisify } = require('util')

const bcrypt = require('bcryptjs')

const scrypt = promisify(crypto.scrypt)

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = await scrypt(String(password), salt, 64)

  return `scrypt:${salt}:${hash.toString('hex')}`
}

async function verifyPassword(password, storedPassword) {
  if (!storedPassword) {
    return false
  }

  if (
    storedPassword.startsWith('$2a$') ||
    storedPassword.startsWith('$2b$') ||
    storedPassword.startsWith('$2y$')
  ) {
    return bcrypt.compare(String(password), storedPassword)
  }

  if (!storedPassword.startsWith('scrypt:')) {
    return false
  }

  const [, salt, storedHash] = storedPassword.split(':')
  const hash = await scrypt(String(password), salt, 64)
  const storedBuffer = Buffer.from(storedHash, 'hex')

  if (storedBuffer.length !== hash.length) {
    return false
  }

  return crypto.timingSafeEqual(storedBuffer, hash)
}

module.exports = {
  hashPassword,
  verifyPassword,
}

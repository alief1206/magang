const crypto = require('crypto')
const { promisify } = require('util')

const scrypt = promisify(crypto.scrypt)

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = await scrypt(String(password), salt, 64)

  return `scrypt:${salt}:${hash.toString('hex')}`
}

async function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.startsWith('scrypt:')) {
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

const crypto = require('crypto')
const env = require('../config/env')

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function decode(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
}

function sign(value) {
  return crypto.createHmac('sha256', env.authTokenSecret).update(value).digest('base64url')
}

function createToken(payload, expiresInSeconds = 60 * 60 * 8) {
  const header = encode({
    alg: 'HS256',
    typ: 'JWT',
  })
  const body = encode({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  })
  const signature = sign(`${header}.${body}`)

  return `${header}.${body}.${signature}`
}

function verifyToken(token) {
  const [header, body, signature] = String(token || '').split('.')

  if (!header || !body || !signature) {
    throw new Error('Token tidak valid.')
  }

  const expectedSignature = sign(`${header}.${body}`)

  if (signature !== expectedSignature) {
    throw new Error('Token tidak valid.')
  }

  const payload = decode(body)

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token sudah kedaluwarsa.')
  }

  return payload
}

module.exports = {
  createToken,
  verifyToken,
}

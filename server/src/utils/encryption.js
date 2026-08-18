const crypto = require('crypto')
const env = require('../config/env')

const PREFIX = 'enc:v1:'

function getKey() {
  return crypto.createHash('sha256').update(env.dataEncryptionKey).digest()
}

function encryptText(value) {
  if (value === undefined) return undefined
  if (value === null || value === '') return value

  const text = String(value)

  if (text.startsWith(PREFIX)) {
    return text
  }

  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return [
    PREFIX.slice(0, -1),
    iv.toString('base64url'),
    authTag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join(':')
}

function decryptText(value) {
  if (value === undefined) return undefined
  if (value === null || value === '') return value

  const text = String(value)

  if (!text.startsWith(PREFIX)) {
    return text
  }

  try {
    const [, , ivValue, authTagValue, encryptedValue] = text.split(':')
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      getKey(),
      Buffer.from(ivValue, 'base64url'),
    )

    decipher.setAuthTag(Buffer.from(authTagValue, 'base64url'))

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, 'base64url')),
      decipher.final(),
    ]).toString('utf8')
  } catch (error) {
    console.error('Decryption error: Failed to decrypt text with current key.')
    return null
  }
}

function encryptFields(data, fields) {
  return fields.reduce(
    (result, field) => ({
      ...result,
      [field]: encryptText(data[field]),
    }),
    { ...data },
  )
}

function decryptFields(data, fields) {
  if (!data) return data

  return fields.reduce(
    (result, field) => ({
      ...result,
      [field]: decryptText(data[field]),
    }),
    { ...data },
  )
}

function decryptRows(rows, fields) {
  return rows.map((row) => decryptFields(row, fields))
}

module.exports = {
  encryptText,
  decryptText,
  encryptFields,
  decryptFields,
  decryptRows,
}

function validateRegisterPayload(payload) {
  const errors = []

  if (!payload.name) errors.push('Nama wajib diisi.')
  if (!payload.email) errors.push('Email wajib diisi.')
  if (!payload.password) errors.push('Password wajib diisi.')

  return errors
}

function validateLoginPayload(payload) {
  const errors = []

  if (!payload.email) errors.push('Email wajib diisi.')
  if (!payload.password) errors.push('Password wajib diisi.')

  return errors
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload,
}

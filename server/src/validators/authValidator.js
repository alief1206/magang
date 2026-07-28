function validateRegisterPayload(payload) {
  const errors = []

  if (!payload.name) errors.push('Nama wajib diisi.')
  if (!payload.email) errors.push('Email wajib diisi.')
  if (!payload.password) errors.push('Password wajib diisi.')
  if (!payload.kelurahanId) errors.push('Kelurahan wajib dipilih.')
  if (payload.role && payload.role !== 'warga') {
    errors.push('Register publik hanya boleh membuat akun warga.')
  }

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

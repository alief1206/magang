const roles = ['warga', 'admin', 'lurah']

function validateCreateUser(payload) {
  const errors = []

  if (!payload.name) errors.push('Nama wajib diisi.')
  if (!payload.email) errors.push('Email wajib diisi.')
  if (!payload.password) errors.push('Password wajib diisi.')
  if (payload.role && !roles.includes(payload.role)) errors.push('Role user tidak valid.')
  if (!payload.kelurahanId) errors.push('Kelurahan wajib dipilih.')

  return errors
}

function validateUpdateUser(payload) {
  const errors = []

  if (payload.role && !roles.includes(payload.role)) errors.push('Role user tidak valid.')

  return errors
}

module.exports = {
  validateCreateUser,
  validateUpdateUser,
}

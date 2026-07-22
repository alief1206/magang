function validateCreateKelurahan(payload) {
  const errors = []

  if (!payload.name) errors.push('Nama kelurahan wajib diisi.')

  return errors
}

module.exports = {
  validateCreateKelurahan,
}

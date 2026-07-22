const assignedRoles = ['admin', 'lurah']
const responderRoles = ['admin', 'lurah']
const statuses = ['baru', 'diproses', 'menunggu_tanggapan', 'ditanggapi', 'selesai', 'ditolak']

function validateCreateAspiration(payload) {
  const errors = []

  if (!payload.name) errors.push('Nama wajib diisi.')
  if (!payload.address) errors.push('Alamat wajib diisi.')
  if (!payload.category) errors.push('Kategori wajib diisi.')
  if (!payload.shortTitle) errors.push('Judul singkat wajib diisi.')
  if (!payload.description) errors.push('Deskripsi wajib diisi.')

  if (payload.assignedToRole && !assignedRoles.includes(payload.assignedToRole)) {
    errors.push('Tujuan aspirasi harus admin atau lurah.')
  }

  return errors
}

function validateCreateResponse(payload) {
  const errors = []

  if (!payload.responderRole || !responderRoles.includes(payload.responderRole)) {
    errors.push('Role penanggap harus admin atau lurah.')
  }

  if (!payload.response) {
    errors.push('Tanggapan wajib diisi.')
  }

  return errors
}

function isValidStatus(status) {
  return statuses.includes(status)
}

module.exports = {
  validateCreateAspiration,
  validateCreateResponse,
  isValidStatus,
}

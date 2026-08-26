const assignedRoles = ['admin', 'lurah']
const responderRoles = ['admin', 'lurah']
const statuses = ['baru', 'diproses', 'menunggu_tanggapan', 'ditanggapi', 'selesai', 'ditolak', 'diteruskan_ke_lurah']
const categories = [
  'Kualitas Pelayanan Administrasi',
  'Pemberdayaan & UMKM',
  'Kegiatan Sosial & Kesehatan',
  'Inovasi & Kegiatan Pemuda',
  'Ketertiban & Keamanan',
  'Infrastruktur',
  'Lainnya',
]

function isBlank(value) {
  return typeof value !== 'string' || !value.trim()
}

function validateIdentityAndCategory(payload, { required }) {
  const errors = []
  const namePattern = /^[\p{L} ]+$/u
  const addressPattern = /^[\p{L}\p{N} ,./-]+$/u

  if (required && isBlank(payload.name)) {
    errors.push('Nama wajib diisi.')
  } else if (payload.name !== undefined && (typeof payload.name !== 'string' || !namePattern.test(payload.name))) {
    errors.push('Nama hanya boleh terdiri dari huruf dan spasi.')
  }

  if (required && isBlank(payload.address)) {
    errors.push('Alamat wajib diisi.')
  } else if (payload.address !== undefined && (typeof payload.address !== 'string' || !addressPattern.test(payload.address))) {
    errors.push('Alamat mengandung karakter yang tidak diperbolehkan.')
  }

  if (payload.category !== undefined && !categories.includes(payload.category)) {
    errors.push('Kategori usulan tidak valid.')
  }

  const priorities = ['Tinggi', 'Sedang', 'Rendah']
  if (payload.priority !== undefined && !priorities.includes(payload.priority)) {
    errors.push('Prioritas usulan tidak valid.')
  }

  return errors
}

function validateCreateAspiration(payload) {
  const errors = validateIdentityAndCategory(payload, { required: true })

  if (isBlank(payload.shortTitle)) errors.push('Judul singkat wajib diisi.')
  if (isBlank(payload.description)) errors.push('Deskripsi wajib diisi.')

  if (payload.assignedToRole && !assignedRoles.includes(payload.assignedToRole)) {
    errors.push('Tujuan aspirasi harus admin atau lurah.')
  }

  if (payload.status && !statuses.includes(payload.status)) {
    errors.push('Status aspirasi tidak valid.')
  }

  validateImage(payload.image, errors)

  return errors
}

function validateUpdateAspiration(payload) {
  const errors = validateIdentityAndCategory(payload, { required: false })

  if (payload.assignedToRole && !assignedRoles.includes(payload.assignedToRole)) {
    errors.push('Tujuan aspirasi harus admin atau lurah.')
  }

  if (payload.status && !statuses.includes(payload.status)) {
    errors.push('Status aspirasi tidak valid.')
  }

  if (payload.image !== undefined) validateImage(payload.image, errors)

  return errors
}

function validateImage(image, errors) {
  if (!image) return

  if (!['image/jpeg', 'image/png'].includes(image.mimeType)) {
    errors.push('Format foto harus JPG, JPEG, atau PNG.')
  }

  if (!Number.isFinite(Number(image.sizeBytes)) || Number(image.sizeBytes) > 20 * 1024 * 1024) {
    errors.push('Ukuran foto maksimal 20 MB.')
  }
}

function validateResponse(payload) {
  const errors = []

  if (!payload.responderRole || !responderRoles.includes(payload.responderRole)) {
    errors.push('Role penanggap harus admin atau lurah.')
  }

  if (!payload.response) {
    errors.push('Tanggapan wajib diisi.')
  }

  return errors
}

module.exports = {
  categories,
  validateCreateAspiration,
  validateUpdateAspiration,
  validateResponse,
}

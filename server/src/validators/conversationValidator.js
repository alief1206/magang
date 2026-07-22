const targetRoles = ['admin', 'lurah']
const senderRoles = ['warga', 'admin', 'lurah', 'system']
const statuses = ['waiting_response', 'answered', 'closed']

function validateCreateConversation(payload) {
  const errors = []

  if (payload.targetRole && !targetRoles.includes(payload.targetRole)) {
    errors.push('Target balasan harus admin atau lurah.')
  }

  if (payload.message && typeof payload.message !== 'string') {
    errors.push('Pesan awal harus berupa teks.')
  }

  return errors
}

function validateCreateMessage(payload) {
  const errors = []

  if (!payload.senderRole || !senderRoles.includes(payload.senderRole)) {
    errors.push('Role pengirim pesan tidak valid.')
  }

  if (!payload.message || typeof payload.message !== 'string') {
    errors.push('Pesan wajib diisi.')
  }

  return errors
}

function isValidStatus(status) {
  return statuses.includes(status)
}

module.exports = {
  validateCreateConversation,
  validateCreateMessage,
  isValidStatus,
}

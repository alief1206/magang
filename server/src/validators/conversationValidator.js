const targetRoles = ['admin', 'lurah']
const senderRoles = ['warga', 'admin', 'lurah', 'system']
const statuses = ['waiting_response', 'answered', 'closed']

function validateConversation(payload) {
  const errors = []

  if (payload.targetRole && !targetRoles.includes(payload.targetRole)) {
    errors.push('Tujuan chat harus admin atau lurah.')
  }

  if (payload.status && !statuses.includes(payload.status)) {
    errors.push('Status chat tidak valid.')
  }

  return errors
}

function validateMessage(payload) {
  const errors = []

  if (!payload.senderRole || !senderRoles.includes(payload.senderRole)) {
    errors.push('Role pengirim pesan tidak valid.')
  }

  if (!payload.message || typeof payload.message !== 'string') {
    errors.push('Pesan wajib diisi.')
  }

  return errors
}

function validateUpdateMessage(payload) {
  const errors = []

  if (!payload.message || typeof payload.message !== 'string') {
    errors.push('Pesan wajib diisi.')
  }

  return errors
}

module.exports = {
  validateConversation,
  validateMessage,
  validateUpdateMessage,
}

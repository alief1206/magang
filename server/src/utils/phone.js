function normalizePhoneNumber(phoneNumber) {
  const digits = String(phoneNumber || '').replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`
  }

  return digits
}

function createWhatsappUrl(phoneNumber, message) {
  const normalizedPhone = normalizePhoneNumber(phoneNumber)

  if (!normalizedPhone) {
    return ''
  }

  return `https://web.whatsapp.com/send?phone=${normalizedPhone}&text=${encodeURIComponent(message)}`
}

module.exports = {
  normalizePhoneNumber,
  createWhatsappUrl,
}

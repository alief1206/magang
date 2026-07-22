const responses = [
  {
    keywords: ['halo', 'hai', 'hello', 'hi'],
    reply: 'Halo! Ada yang bisa saya bantu?',
  },
  {
    keywords: ['jadwal', 'magang'],
    reply: 'Untuk informasi jadwal magang, silakan sebutkan tanggal atau kegiatan yang ingin dicek.',
  },
  {
    keywords: ['terima kasih', 'makasih', 'thanks'],
    reply: 'Sama-sama. Senang bisa membantu.',
  },
]

function normalizeMessage(message) {
  return String(message || '')
    .trim()
    .toLowerCase()
}

function generateReply(message) {
  const normalizedMessage = normalizeMessage(message)

  if (!normalizedMessage) {
    return 'Pesan belum boleh kosong.'
  }

  const matchedResponse = responses.find((response) =>
    response.keywords.some((keyword) => normalizedMessage.includes(keyword)),
  )

  if (matchedResponse) {
    return matchedResponse.reply
  }

  return 'Maaf, saya belum memahami pesan itu. Pengetahuan chatbot ini akan terus kita kembangkan.'
}

module.exports = {
  generateReply,
}

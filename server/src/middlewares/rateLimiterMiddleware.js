const rateLimit = require('express-rate-limit')

// Rate Limiter khusus untuk Login (Proteksi Brute Force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Maksimal 5 kali percobaan per IP dalam 15 menit
  standardHeaders: true, // Kembalikan info rate limit di header `RateLimit-*`
  legacyHeaders: false, // Matikan header `X-RateLimit-*`
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login gagal dari IP ini. Silakan coba lagi setelah 15 menit demi keamanan akun.',
  },
})

// Rate Limiter umum untuk mencegah Spam & DDoS pada API publik
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 100, // Maksimal 100 request per IP per menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dalam waktu singkat. Silakan tunggu sebentar.',
  },
})

module.exports = {
  loginLimiter,
  apiLimiter,
}

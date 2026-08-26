const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  authTokenSecret: process.env.AUTH_TOKEN_SECRET || 'ganti-secret-token-ini',
  dataEncryptionKey: process.env.DATA_ENCRYPTION_KEY || 'ganti-key-enkripsi-data-ini',
  whatsappWebhookSecret: process.env.WHATSAPP_WEBHOOK_SECRET || '',
  fonnteToken: process.env.FONNTE_TOKEN || '',
  nomorLurah: process.env.NOMOR_LURAH || '',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'desa_digital_db',
  },
}

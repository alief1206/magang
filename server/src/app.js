const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const path = require('path')
const env = require('./config/env')
const routes = require('./routes')
const errorMiddleware = require('./middlewares/errorMiddleware')
const notFoundMiddleware = require('./middlewares/notFoundMiddleware')

const { apiLimiter } = require('./middlewares/rateLimiterMiddleware')

const app = express()

// 1. Inisialisasi CORS di paling atas middleware stack agar dapat menangani HTTP OPTIONS preflight request secara global
const allowedOrigins = [
  env.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan request tanpa Origin (seperti curl, mobile apps, Postman)
    if (!origin) return callback(null, true)

    const cleanOrigin = origin.replace(/\/$/, '')
    const isAllowed = allowedOrigins.some(
      (o) => o && o.replace(/\/$/, '') === cleanOrigin
    )

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-auth-token'],
}

app.use(cors(corsOptions))

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(compression())
app.use(apiLimiter)
app.use(express.json({ limit: '27mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use(routes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

module.exports = app

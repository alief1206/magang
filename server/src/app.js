const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const path = require('path')
const env = require('./config/env')
const routes = require('./routes')
const errorMiddleware = require('./middlewares/errorMiddleware')
const notFoundMiddleware = require('./middlewares/notFoundMiddleware')

const app = express()

app.use(helmet())
app.use(compression())
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
)
app.use(express.json({ limit: '27mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use(routes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

module.exports = app

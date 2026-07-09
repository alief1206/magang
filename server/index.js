const compression = require('compression')
const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const helmet = require('helmet')
const { generateReply } = require('./services/chatbot')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(helmet())
app.use(compression())
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
)
app.use(express.json())

app.get('/', (_req, res) => {
  res.json({
    message: 'Server API is running',
  })
})

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
  })
})

app.post('/api/chat', (req, res) => {
  const { message } = req.body

  res.json({
    reply: generateReply(message),
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

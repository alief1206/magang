const app = require('./src/app')
const env = require('./src/config/env')

const server = app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`)
})

// Keep Node.js event loop active for Express dev server
const keepAlive = setInterval(() => {}, 1000)

process.on('SIGTERM', () => {
  clearInterval(keepAlive)
  server.close()
})

process.on('SIGINT', () => {
  clearInterval(keepAlive)
  server.close()
})

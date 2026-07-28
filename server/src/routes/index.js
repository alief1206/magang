const express = require('express')
const aspirationRoutes = require('./aspirationRoutes')
const authRoutes = require('./authRoutes')
const chatRoutes = require('./chatRoutes')
const conversationRoutes = require('./conversationRoutes')
const healthRoutes = require('./healthRoutes')
const kelurahanRoutes = require('./kelurahanRoutes')
const rootRoutes = require('./rootRoutes')
const userRoutes = require('./userRoutes')
const whatsappRoutes = require('./whatsappRoutes')

const router = express.Router()

router.use('/', rootRoutes)
router.use('/health', healthRoutes)
router.use('/api/auth', authRoutes)
router.use('/api/chat', chatRoutes)
router.use('/api/chats', conversationRoutes)
router.use('/api/aspirations', aspirationRoutes)
router.use('/api/kelurahans', kelurahanRoutes)
router.use('/api/users', userRoutes)
router.use('/api/whatsapp', whatsappRoutes)

module.exports = router

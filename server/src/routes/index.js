const express = require('express')
const aspirationRoutes = require('./aspirationRoutes')
const authRoutes = require('./authRoutes')
const chatRoutes = require('./chatRoutes')
const conversationRoutes = require('./conversationRoutes')
const healthRoutes = require('./healthRoutes')
const rootRoutes = require('./rootRoutes')
const userRoutes = require('./userRoutes')

const router = express.Router()

router.use('/', rootRoutes)
router.use('/health', healthRoutes)
router.use('/api/auth', authRoutes)
router.use('/api/chat', chatRoutes)
router.use('/api/chats', conversationRoutes)
router.use('/api/aspirations', aspirationRoutes)
router.use('/api/users', userRoutes)

module.exports = router

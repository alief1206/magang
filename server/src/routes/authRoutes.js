const express = require('express')
const authController = require('../controllers/authController')
const { loginLimiter } = require('../middlewares/rateLimiterMiddleware')

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', loginLimiter, authController.login)

module.exports = router

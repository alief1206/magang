const express = require('express')
const userController = require('../controllers/userController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(authMiddleware)
router.use(adminMiddleware)

router.get('/', userController.getUsers)
router.post('/', userController.createUser)
router.get('/:id', userController.getUserById)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router

const express = require('express')
const aspirationController = require('../controllers/aspirationController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', aspirationController.createAspiration)
router.get('/', authMiddleware, adminMiddleware, aspirationController.getAspirations)
router.get('/:id', authMiddleware, adminMiddleware, aspirationController.getAspirationById)
router.put('/:id', authMiddleware, adminMiddleware, aspirationController.updateAspiration)
router.delete('/:id', authMiddleware, adminMiddleware, aspirationController.deleteAspiration)
router.post('/:id/responses', authMiddleware, adminMiddleware, aspirationController.addResponse)
router.put(
  '/:id/responses/:responseId',
  authMiddleware,
  adminMiddleware,
  aspirationController.updateResponse,
)
router.delete(
  '/:id/responses/:responseId',
  authMiddleware,
  adminMiddleware,
  aspirationController.deleteResponse,
)

module.exports = router

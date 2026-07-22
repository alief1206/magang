const express = require('express')
const kelurahanController = require('../controllers/kelurahanController')
const adminMiddleware = require('../middlewares/adminMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', kelurahanController.getKelurahans)
router.get('/:id', kelurahanController.getKelurahanById)
router.post('/', authMiddleware, adminMiddleware, kelurahanController.createKelurahan)
router.put('/:id', authMiddleware, adminMiddleware, kelurahanController.updateKelurahan)
router.delete('/:id', authMiddleware, adminMiddleware, kelurahanController.deleteKelurahan)

module.exports = router

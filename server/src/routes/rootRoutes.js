const express = require('express')
const rootController = require('../controllers/rootController')

const router = express.Router()

router.get('/', rootController.getRoot)

module.exports = router

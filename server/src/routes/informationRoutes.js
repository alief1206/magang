const express = require('express');
const router = express.Router();
const informationController = require('../controllers/informationController');
const authMiddleware = require('../middlewares/authMiddleware');
const optionalAuthMiddleware = require('../middlewares/optionalAuthMiddleware');

// GET request is public (optional auth)
router.get('/', optionalAuthMiddleware, informationController.getInformations);

// POST request requires authentication
router.post('/', authMiddleware, informationController.createInformation);

module.exports = router;

const express = require('express');
const router = express.Router();
const terminalController = require('../controllers/terminalController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, terminalController.getTerminals);

module.exports = router;

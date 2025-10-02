const express = require('express');
const router = express.Router();
const {
  getBusInfo,
} = require('../controllers/busController');

const authMiddleware = require('../middleware/authMiddleware'); // import your auth

// Get bus + driver info (authenticated)
router.get('/:busId/info', authMiddleware, getBusInfo);


module.exports = router;

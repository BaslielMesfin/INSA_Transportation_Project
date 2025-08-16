const express = require('express');
const router = express.Router();
const { getAllBuses, getNearbyBuses } = require('../controllers/busesController');
const authMiddleware = require('../middleware/auth');

// Get all active buses
router.get('/all', authMiddleware, getAllBuses);

// Get nearby buses on a route
router.get('/nearby', authMiddleware, getNearbyBuses);

module.exports = router;

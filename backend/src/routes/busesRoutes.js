const express = require('express');
const router = express.Router();
const { getAllBuses, searchBusesByRoute } = require('../controllers/busesController'); // <-- fixed

const authMiddleware = require('../middleware/authMiddleware');

// Get all active buses
router.get('/all', authMiddleware, getAllBuses);

// Search buses by start & end terminals (with proximity + ETA)
router.get('/search', authMiddleware, searchBusesByRoute);

module.exports = router;

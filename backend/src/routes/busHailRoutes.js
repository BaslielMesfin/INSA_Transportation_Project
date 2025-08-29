const express = require('express');
const router = express.Router();
const {
  requestHail,
  getMyHails,
  getPendingHails,
  assignBus
} = require('../controllers/busHailController');

const authMiddleware = require('../middleware/authMiddleware');

// Passenger: request a bus
router.post('/', authMiddleware, requestHail);

// Passenger: view own hails
router.get('/my', authMiddleware, getMyHails);

// Admin: view pending hails
router.get('/pending', authMiddleware, getPendingHails);

// Admin: assign a bus to a hail
router.patch('/:hailId/assign', authMiddleware, assignBus);

module.exports = router;

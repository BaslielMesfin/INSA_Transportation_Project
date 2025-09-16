const express = require('express');
const router = express.Router();
const {
  requestHail,
  getMyHails,
  getPendingHails,
  assignBusToHailGroup
} = require('../controllers/busHailController');

const authMiddleware = require('../middleware/authMiddleware'); 

// Passenger: request a bus
router.post('/', authMiddleware, requestHail);

// Passenger: view own hails
router.get('/my', authMiddleware, getMyHails);

// Admin: view pending hails
router.get('/pending', authMiddleware, getPendingHails);

// Admin: assign a bus to a hail
router.patch('/assign', authMiddleware, assignBusToHailGroup);

module.exports = router;

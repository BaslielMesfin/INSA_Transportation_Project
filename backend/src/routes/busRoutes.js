const express = require('express');
const router = express.Router();
const {
  getBusInfo,
  submitFeedback,
  getFeedback,
} = require('../controllers/busController');

const authMiddleware = require('../middleware/authMiddleware'); // import your auth

// Get bus + driver info (authenticated)
router.get('/:busId/info', authMiddleware, getBusInfo);

// Submit feedback (authenticated)
router.post('/:busId/feedback', authMiddleware, submitFeedback);

// Get feedback + average rating (authenticated)
router.get('/:busId/feedback', authMiddleware, getFeedback);

module.exports = router;

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addBus,
  removeBus,
  assignDriver,
  reviewFeedback,
  updateBus,
} = require('../controllers/adminBusController');

// Only authenticated users
router.use(authMiddleware);

// Only company admins can manage buses
const companyAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'COMPANY_ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Company Admins only' });
  }
  next();
};

router.use(companyAdminOnly);

// Bus routes
router.post("/", addBus);
router.delete("/:busId", removeBus);
router.patch("/:busId/assign-driver", assignDriver);
router.get("/:busId/feedback", reviewFeedback);
router.patch("/:busId", updateBus);

module.exports = router;

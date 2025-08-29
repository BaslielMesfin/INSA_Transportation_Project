const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireSuperAdmin = require('../middleware/requireSuperAdmin');

// Import controllers
const {
  getAllCompanies,
  updateCompanyStatus,
  getCompanyDetails
} = require('../controllers/superadmin/companyController');

const { getSystemAnalytics } = require('../controllers/superadmin/analyticsController');

// Apply auth and superadmin check to all routes
router.use(authMiddleware);
router.use(requireSuperAdmin);

// Company management routes
router.get('/companies', getAllCompanies);
router.put('/companies/:companyId/status', updateCompanyStatus);
router.get('/companies/:companyId', getCompanyDetails);

// Analytics routes
router.get('/analytics', getSystemAnalytics);

module.exports = router;
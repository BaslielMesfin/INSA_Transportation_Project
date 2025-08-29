const express = require("express");
const { fleetPerformance, driverActivity, passengerSatisfaction } = require("../controllers/adminReportController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// All reports are admin-only
router.get("/fleet", authenticate, authorize("ADMIN"), fleetPerformance);
router.get("/drivers", authenticate, authorize("ADMIN"), driverActivity);
router.get("/satisfaction", authenticate, authorize("ADMIN"), passengerSatisfaction);

module.exports = router;

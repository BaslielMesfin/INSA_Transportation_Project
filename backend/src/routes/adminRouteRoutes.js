const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  addRoute,
  updateRoute,
  removeRoute,
  getRoutes,
} = require("../controllers/adminRouteController");

// Middleware: Only COMPANY_ADMIN can access
const companyAdminOnly = (req, res, next) => {
    console.log("User role:", req.user.role); // Debug
    if (req.user.role !== "COMPANY_ADMIN") {
      return res.status(403).json({ message: "Forbidden: Company Admins only" });
    }
    next();
  };

// Use JWT auth first
router.use(authMiddleware);

// Then restrict to COMPANY_ADMIN
router.use(companyAdminOnly);

// Routes
router.post("/", addRoute);
router.get("/", getRoutes);
router.patch("/:routeId", updateRoute);
router.delete("/:routeId", removeRoute);

module.exports = router;

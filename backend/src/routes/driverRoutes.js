const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const pool = require("../config/db.js");
const {
  submitDriverFeedback,
  getDriverFeedback
} = require("../controllers/busController"); // your controller already has these

// ✅ Get driver profile by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, name, email FROM drivers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching driver:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Submit feedback for a driver
router.post("/:driverId/feedback", authMiddleware, submitDriverFeedback);

// ✅ Get feedback + average rating for a driver
router.get("/:driverId/feedback", authMiddleware, getDriverFeedback);

module.exports = router;

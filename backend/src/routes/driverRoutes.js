import express from "express";
import pool from "../db.js";

const router = express.Router();

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

export default router;

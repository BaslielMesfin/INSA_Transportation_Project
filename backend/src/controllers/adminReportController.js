const pool = require("../config/db");

// Fleet Performance Report
const fleetPerformance = async (req, res) => {
  const companyId = req.user.companyId;

  try {
    const totalBuses = await pool.query(
      "SELECT COUNT(*) FROM buses WHERE company_id = $1",
      [companyId]
    );

    const activeBuses = await pool.query(
      "SELECT COUNT(*) FROM buses WHERE company_id = $1 AND status = 'ACTIVE'",
      [companyId]
    );

    const inactiveBuses = await pool.query(
      "SELECT COUNT(*) FROM buses WHERE company_id = $1 AND status != 'ACTIVE'",
      [companyId]
    );

    const avgCapacity = await pool.query(
      "SELECT AVG(capacity)::numeric(5,2) AS avg_capacity FROM buses WHERE company_id = $1",
      [companyId]
    );

    res.json({
      totalBuses: parseInt(totalBuses.rows[0].count),
      activeBuses: parseInt(activeBuses.rows[0].count),
      inactiveBuses: parseInt(inactiveBuses.rows[0].count),
      averageCapacity: avgCapacity.rows[0].avg_capacity || 0,
    });
  } catch (err) {
    console.error("Error generating fleet report:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Driver Activity Report
const driverActivity = async (req, res) => {
  const companyId = req.user.companyId;

  try {
    const result = await pool.query(
      `SELECT u.id AS driver_id, u.name AS driver_name,
              COUNT(t.id) AS trips_count,
              MAX(t.created_at) AS last_trip
       FROM users u
       LEFT JOIN trips t ON u.id = t.driver_id
       WHERE u.role = 'DRIVER' AND u.company_id = $1
       GROUP BY u.id, u.name
       ORDER BY trips_count DESC`,
      [companyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error generating driver report:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Passenger Satisfaction Report
const passengerSatisfaction = async (req, res) => {
  const companyId = req.user.companyId;

  try {
    const result = await pool.query(
      `SELECT b.id AS bus_id, b.plate_number,
              AVG(f.rating)::numeric(2,1) AS avg_rating,
              COUNT(f.id) AS feedback_count
       FROM buses b
       LEFT JOIN bus_feedback f ON b.id = f.bus_id
       WHERE b.company_id = $1
       GROUP BY b.id, b.plate_number
       ORDER BY avg_rating DESC NULLS LAST`,
      [companyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error generating passenger satisfaction report:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { fleetPerformance, driverActivity, passengerSatisfaction };

const pool = require("../config/db");

// Add route
const addRoute = async (req, res) => {
  const { name, startTerminalId, endTerminalId, distanceKm, estimatedTime } = req.body;
  const companyId = req.user.companyId;

  if (!name || !startTerminalId || !endTerminalId)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const result = await pool.query(
      `INSERT INTO routes (company_id, name, start_terminal_id, end_terminal_id, distance_km, estimated_time)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [companyId, name, startTerminalId, endTerminalId, distanceKm || null, estimatedTime || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update route
const updateRoute = async (req, res) => {
  const { routeId } = req.params;
  const { name, startTerminalId, endTerminalId, distanceKm, estimatedTime } = req.body;
  const companyId = req.user.companyId;

  try {
    const check = await pool.query(
      'SELECT id FROM routes WHERE id=$1 AND company_id=$2',
      [routeId, companyId]
    );
    if (check.rows.length === 0)
      return res.status(404).json({ message: 'Route not found or unauthorized' });

    const result = await pool.query(
      `UPDATE routes SET
       name=COALESCE($1, name),
       start_terminal_id=COALESCE($2, start_terminal_id),
       end_terminal_id=COALESCE($3, end_terminal_id),
       distance_km=COALESCE($4, distance_km),
       estimated_time=COALESCE($5, estimated_time),
       updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [name, startTerminalId, endTerminalId, distanceKm, estimatedTime, routeId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete route   making inactive
const removeRoute = async (req, res) => {
  const { routeId } = req.params;
  const companyId = req.user.companyId;

  try {
    // Check route ownership
    const check = await pool.query(
      'SELECT id FROM routes WHERE id=$1 AND company_id=$2',
      [routeId, companyId]
    );
    if (check.rows.length === 0)
      return res.status(404).json({ message: 'Route not found or unauthorized' });

    // Soft delete: mark as inactive
    await pool.query(
      'UPDATE routes SET is_active = FALSE, updated_at = NOW() WHERE id = $1',
      [routeId]
    );

    res.json({ message: 'Route marked as inactive (soft deleted)' });
  } catch (err) {
    console.error('Error soft deleting route:', err.message, err);
    res.status(500).json({ message: 'Server error while deleting route' });
  }
};




// Get all routes
const getRoutes = async (req, res) => {
  const companyId = req.user.companyId;
  try {
    const result = await pool.query(
      'SELECT * FROM routes WHERE company_id=$1 ORDER BY created_at DESC',
      [companyId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addRoute, updateRoute, removeRoute, getRoutes };

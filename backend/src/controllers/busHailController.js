const pool = require('../config/db');

// Create a new hail request
const requestHail = async (req, res) => {
  const passengerId = req.user.id; // from JWT token
  const { terminalLocation, routeId } = req.body;

  if (!terminalLocation) {
    return res.status(400).json({ message: 'Terminal location is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bus_hails (passenger_id, terminal_location, route_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [passengerId, terminalLocation, routeId || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all hail requests for passenger
const getMyHails = async (req, res) => {
  const passengerId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM bus_hails WHERE passenger_id = $1 ORDER BY created_at DESC`,
      [passengerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all pending hails for company
const getPendingHails = async (req, res) => {
  const companyId = req.user.companyId; // assuming COMPANY_ADMIN or DRIVER

  try {
    const result = await pool.query(
      `SELECT bh.*, u.name AS passenger_name, u.phone_number AS passenger_phone
       FROM bus_hails bh
       JOIN users u ON bh.passenger_id = u.id
       JOIN routes r ON bh.route_id = r.id
       WHERE r.company_id = $1 AND bh.status = 'PENDING'
       ORDER BY bh.created_at ASC`,
      [companyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Assign bus to hail request
const assignBus = async (req, res) => {
  const { hailId } = req.params;
  const { busId } = req.body;

  try {
    const result = await pool.query(
      `UPDATE bus_hails
       SET assigned_bus_id = $1, status = 'ASSIGNED', updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [busId, hailId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Hail request not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { requestHail, getMyHails, getPendingHails, assignBus };

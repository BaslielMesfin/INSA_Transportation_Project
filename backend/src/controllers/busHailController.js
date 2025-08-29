const pool = require('../config/db');

// Create a new hail request
const requestHail = async (req, res) => {
  const passengerId = req.user.id;
  const { startTerminalId, endTerminalId } = req.body;

  console.log('Request received:', { passengerId, startTerminalId, endTerminalId }); // Debug log

  // Validate required fields
  if (!startTerminalId || !endTerminalId) {
    return res.status(400).json({ message: 'Start and end terminals are required' });
  }

  // Prevent start and end terminals from being the same
  if (startTerminalId === endTerminalId) {
    console.log('Validation failed: Same terminals'); // Debug log
    return res.status(400).json({ message: 'Start and end terminals cannot be the same' });
  }

  try {
    // Check if user already has a request with same terminals today
    const existing = await pool.query(
      `SELECT 1
       FROM bus_hails
       WHERE passenger_id = $1
         AND start_terminal_id = $2
         AND end_terminal_id = $3
         AND created_at::date = CURRENT_DATE`,
      [passengerId, startTerminalId, endTerminalId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'You already made a request for these terminals today' });
    }

    const result = await pool.query(
      `INSERT INTO bus_hails (passenger_id, start_terminal_id, end_terminal_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [passengerId, startTerminalId, endTerminalId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in requestHail:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all hail requests for passenger
const getMyHails = async (req, res) => {
  const passengerId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT bh.*, st.name AS start_terminal, et.name AS end_terminal
       FROM bus_hails bh
       JOIN terminals st ON bh.start_terminal_id = st.id
       JOIN terminals et ON bh.end_terminal_id = et.id
       WHERE bh.passenger_id = $1
       ORDER BY bh.created_at DESC`,
      [passengerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getPendingHails = async (req, res) => {
  try {
    const HAIL_THRESHOLD = 40;

    const result = await pool.query(
      `SELECT 
          MIN(bh.created_at) AS first_request_time,
          bh.start_terminal_id,
          bh.end_terminal_id,
          t1.name AS start_terminal,
          t2.name AS end_terminal,
          COUNT(*) AS number_of_hails,
          -- Remove MIN() from UUID and enum columns, use array_agg or other approach
          array_agg(DISTINCT bh.assigned_bus_id) FILTER (WHERE bh.assigned_bus_id IS NOT NULL) AS assigned_bus_ids,
          array_agg(DISTINCT bh.status) AS statuses
       FROM bus_hails bh
       JOIN terminals t1 ON bh.start_terminal_id = t1.id
       JOIN terminals t2 ON bh.end_terminal_id = t2.id
       WHERE bh.status = 'PENDING'
       GROUP BY bh.start_terminal_id, bh.end_terminal_id, t1.name, t2.name
       HAVING COUNT(*) >= $1
       ORDER BY number_of_hails DESC`,
      [HAIL_THRESHOLD]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignBusToHailGroup = async (req, res) => {
  const { startTerminalId, endTerminalId, busId } = req.body;

  if (!startTerminalId || !endTerminalId || !busId) {
    return res.status(400).json({ message: 'startTerminalId, endTerminalId, and busId are required' });
  }

  try {
    // First, verify the bus exists and is active
    const busCheck = await pool.query(
      `SELECT id FROM buses WHERE id = $1 AND status = 'ACTIVE'`,
      [busId]
    );

    if (busCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Bus not found or not active' });
    }

    // Verify terminals exist
    const terminalCheck = await pool.query(
      `SELECT id FROM terminals WHERE id IN ($1, $2)`,
      [startTerminalId, endTerminalId]
    );

    if (terminalCheck.rows.length !== 2) {
      return res.status(404).json({ message: 'One or both terminals not found' });
    }

    // Update all PENDING hails for this start & end terminal
    const result = await pool.query(
      `UPDATE bus_hails
       SET assigned_bus_id = $1,
           status = 'ASSIGNED',
           updated_at = NOW()
       WHERE start_terminal_id = $2
         AND end_terminal_id = $3
         AND status = 'PENDING'
       RETURNING *`,
      [busId, startTerminalId, endTerminalId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        message: 'No pending hails found for this route',
        details: `Start: ${startTerminalId}, End: ${endTerminalId}`
      });
    }

    res.json({
      message: `Successfully assigned ${result.rows.length} hails to bus ${busId}`,
      assignedCount: result.rows.length,
      assignedHails: result.rows
    });

  } catch (err) {
    console.error('Assignment error:', err);
    res.status(500).json({ 
      message: 'Server error during assignment',
      error: err.message 
    });
  }
};

module.exports = { requestHail, getMyHails, getPendingHails, assignBusToHailGroup };

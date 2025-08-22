const pool = require('../config/db.js');

const addBus = async (req, res) => {
    console.log('Authenticated user payload:', req.user);
  
    const { plateNumber, capacity } = req.body;
    const companyId = req.user.companyId || null; // safe default
  
    if (!companyId) {
      console.error('Missing companyId in JWT!');
      return res.status(403).json({ message: 'Unauthorized: no company assigned' });
    }
  
    if (!plateNumber || !capacity || capacity <= 0) {
      return res.status(400).json({ message: 'Invalid input' });
    }
  
    try {
      const result = await pool.query(
        `INSERT INTO buses (company_id, plate_number, capacity)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [companyId, plateNumber, capacity]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error adding bus:', err);
  
      if (err.code === '23505') { // unique violation (plate_number)
        return res.status(400).json({ message: 'Plate number already exists' });
      }
  
      res.status(500).json({ message: 'Server error' });
    }
  };
  

const removeBus = async (req, res) => {
  const { busId } = req.params;
  const companyId = req.user.companyId;

  try {
    const check = await pool.query(
      'SELECT id FROM buses WHERE id = $1 AND company_id = $2',
      [busId, companyId]
    );

    if (check.rows.length === 0)
      return res.status(404).json({ message: 'Bus not found or unauthorized' });

    await pool.query('DELETE FROM buses WHERE id = $1', [busId]);
    res.json({ message: 'Bus removed successfully' });
  } catch (err) {
    console.error('Error removing bus:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignDriver = async (req, res) => {
  const { busId } = req.params;
  const { driverId } = req.body;
  const companyId = req.user.companyId;

  if (!driverId) return res.status(400).json({ message: 'driverId is required' });

  try {
    const busCheck = await pool.query(
      'SELECT id FROM buses WHERE id = $1 AND company_id = $2',
      [busId, companyId]
    );
    if (busCheck.rows.length === 0)
      return res.status(404).json({ message: 'Bus not found or unauthorized' });

    const driverCheck = await pool.query(
      'SELECT id FROM users WHERE id = $1 AND role = $2',
      [driverId, 'DRIVER']
    );
    if (driverCheck.rows.length === 0)
      return res.status(400).json({ message: 'Driver not found or invalid role' });

    const assignedCheck = await pool.query(
      'SELECT id FROM buses WHERE driver_id = $1',
      [driverId]
    );
    if (assignedCheck.rows.length > 0)
      return res.status(400).json({ message: 'Driver already assigned to another bus' });

    const result = await pool.query(
      'UPDATE buses SET driver_id = $1 WHERE id = $2 RETURNING *',
      [driverId, busId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error assigning driver:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const reviewFeedback = async (req, res) => {
  const { busId } = req.params;
  const companyId = req.user.companyId;

  try {
    const busCheck = await pool.query(
      'SELECT id FROM buses WHERE id = $1 AND company_id = $2',
      [busId, companyId]
    );
    if (busCheck.rows.length === 0)
      return res.status(404).json({ message: 'Bus not found or unauthorized' });

    const feedbackResult = await pool.query(
      `SELECT passenger_id, rating, comment, created_at
       FROM bus_feedback
       WHERE bus_id = $1
       ORDER BY created_at DESC`,
      [busId]
    );

    const avgResult = await pool.query(
      `SELECT AVG(rating)::numeric(2,1) AS average_rating
       FROM bus_feedback
       WHERE bus_id = $1`,
      [busId]
    );

    res.json({
      busId,
      averageRating: avgResult.rows[0].average_rating || 0,
      feedback: feedbackResult.rows,
    });
  } catch (err) {
    console.error('Error reviewing feedback:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateBus = async (req, res) => {
    const { busId } = req.params;
    const companyId = req.user.companyId;
    const { plateNumber, capacity, status } = req.body;
  
    try {
      // Check bus exists and belongs to this company
      const busCheck = await pool.query(
        'SELECT * FROM buses WHERE id = $1 AND company_id = $2',
        [busId, companyId]
      );
  
      if (busCheck.rows.length === 0)
        return res.status(404).json({ message: 'Bus not found or unauthorized' });
  
      // Update only the fields provided
      const updatedBus = await pool.query(
        `UPDATE buses
         SET plate_number = COALESCE($1, plate_number),
             capacity = COALESCE($2, capacity),
             status = COALESCE($3, status),
             updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [plateNumber, capacity, status, busId]
      );
  
      res.json(updatedBus.rows[0]);
    } catch (err) {
      console.error('Error updating bus:', err);
      if (err.code === '23505') {
        return res.status(400).json({ message: 'Plate number already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = { addBus, removeBus, assignDriver, reviewFeedback, updateBus };

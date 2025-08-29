const pool = require('../config/db.js');  

// Get driver & bus info
const getBusInfo = async (req, res) => {
  const { busId } = req.params;

  try {
    const result = await pool.query(
      `SELECT b.id AS bus_id, b.plate_number, b.capacity, b.status,
              u.id AS driver_id, u.name AS driver_name, u.phone_number
       FROM buses b
       LEFT JOIN users u ON b.driver_id = u.id
       WHERE b.id = $1`,
      [busId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Bus not found' });

    const bus = result.rows[0];
    res.json({
      busId: bus.bus_id,
      plateNumber: bus.plate_number,
      capacity: bus.capacity,
      status: bus.status,
      driver: {
        id: bus.driver_id,
        name: bus.driver_name,
        phone: bus.phone_number,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit feedback 

const submitFeedback = async (req, res) => {
    const { busId } = req.params;
    const passengerId = req.user.id; // comes from JWT token
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: 'Invalid input' });

    try {
      // Check passenger exists and role is PASSENGER
      const passengerCheck = await pool.query(
        'SELECT id FROM users WHERE id = $1 AND role = $2',
        [passengerId, 'PASSENGER']
      );

      if (passengerCheck.rows.length === 0)
        return res.status(403).json({ message: 'User not authorized to submit feedback' });

      const result = await pool.query(
        `INSERT INTO bus_feedback (bus_id, passenger_id, rating, comment)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [busId, passengerId, rating, comment || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};

  

// Get feedback + average rating
const getFeedback = async (req, res) => {
  const { busId } = req.params;

  try {
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
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBusInfo, submitFeedback, getFeedback };

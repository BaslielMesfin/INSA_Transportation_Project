const pool = require('../db'); // your postgres pool

// Get all active buses
const getAllBuses = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.plate_number, b.capacity, b.status,
             bl.latitude, bl.longitude, bl.recorded_at
      FROM buses b
      JOIN bus_locations bl ON b.id = bl.bus_id
      WHERE b.status = 'ACTIVE'
    `);

    return res.json({ buses: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get nearby buses on a route
const getNearbyBuses = async (req, res) => {
  try {
    const { route_id, user_lat, user_lng, radius_km = 1 } = req.query;

    if (!route_id || !user_lat || !user_lng) {
      return res.status(400).json({ error: 'route_id, user_lat and user_lng required' });
    }

    // Simple distance calculation (Haversine formula in SQL)
    const result = await pool.query(`
      SELECT b.id, b.plate_number, b.capacity, b.status,
             bl.latitude, bl.longitude, bl.recorded_at,
             ( 6371 * acos(
                cos(radians($1)) * cos(radians(bl.latitude))
                * cos(radians(bl.longitude) - radians($2))
                + sin(radians($1)) * sin(radians(bl.latitude))
             )) AS distance_km
      FROM buses b
      JOIN bus_locations bl ON b.id = bl.bus_id
      WHERE b.status = 'ACTIVE' AND b.company_id IN (
        SELECT company_id FROM routes WHERE id = $3
      )
      HAVING distance_km <= $4
      ORDER BY distance_km ASC
    `, [user_lat, user_lng, route_id, radius_km]);

    return res.json({ buses: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllBuses, getNearbyBuses };

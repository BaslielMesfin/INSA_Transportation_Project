const pool = require('../config/db'); // PostgreSQL pool
const axios = require('axios');

const GEBETA_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55bmFtZSI6IkJhc2xpZWwiLCJkZXNjcmlwdGlvbiI6ImFlZTIwNmIzLThhNTktNDE4Ni1hYTI0LTBlMTlhZmRkNjI2MCIsImlkIjoiYmZiNzUwZGUtNTUzZS00NzY3LWJiNmYtYTAzYWYwNDEwOWJiIiwiaXNzdWVkX2F0IjoxNzU1MjQyNjA0LCJpc3N1ZXIiOiJodHRwczovL21hcGFwaS5nZWJldGEuYXBwIiwiand0X2lkIjoiMCIsInNjb3BlcyI6WyJGRUFUVVJFX0FMTCJdLCJ1c2VybmFtZSI6IkJhc2xpZWwifQ.B9wVC1E6zdMi6-k5h2urF39Ln1jrLeWrbCgS1kqNOAY'; // keep your actual API key

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

// Search buses by start & end terminal names, filtered by proximity and ETA
// Search buses by start & end terminal names, filtered by proximity and ETA
const searchBusesByRoute = async (req, res) => {
  try {
    const { start_terminal_name, end_terminal_name, user_lat, user_lng, radius_km = 5 } = req.query;

    if (!start_terminal_name || !end_terminal_name || !user_lat || !user_lng) {
      return res.status(400).json({ error: 'start_terminal_name, end_terminal_name, user_lat and user_lng are required' });
    }

    // 1️⃣ Find terminals matching input names
    const startTerminalsRes = await pool.query(`
      SELECT id, name FROM terminals
      WHERE name ILIKE $1
    `, [`%${start_terminal_name}%`]);
    const endTerminalsRes = await pool.query(`
      SELECT id, name FROM terminals
      WHERE name ILIKE $1
    `, [`%${end_terminal_name}%`]);

    const startTerminalIds = startTerminalsRes.rows.map(t => t.id);
    const endTerminalIds = endTerminalsRes.rows.map(t => t.id);

    if (startTerminalIds.length === 0 || endTerminalIds.length === 0) {
      return res.status(404).json({ error: 'No matching start or end terminals found' });
    }

    // 2️⃣ Find routes connecting those terminals
    const routeResult = await pool.query(`
      SELECT r.id AS route_id, r.name AS route_name, r.company_id, t_start.name AS start_terminal, t_end.name AS end_terminal
      FROM routes r
      JOIN terminals t_start ON r.start_terminal_id = t_start.id
      JOIN terminals t_end ON r.end_terminal_id = t_end.id
      WHERE r.start_terminal_id = ANY($1::uuid[])
        AND r.end_terminal_id = ANY($2::uuid[])
    `, [startTerminalIds, endTerminalIds]);

    let routes = routeResult.rows;
    let alternative_routes = [];
    let buses = [];

    // 3️⃣ If no exact route, find alternative routes ending at end terminal
    if (routes.length === 0) {
      const altRouteResult = await pool.query(`
        SELECT r.id AS route_id, r.name AS route_name, r.company_id,
               t_start.name AS start_terminal, t_end.name AS end_terminal
        FROM routes r
        JOIN terminals t_start ON r.start_terminal_id = t_start.id
        JOIN terminals t_end ON r.end_terminal_id = t_end.id
        WHERE r.end_terminal_id = ANY($1::uuid[])
      `, [endTerminalIds]);

      alternative_routes = altRouteResult.rows;
      routes = alternative_routes;
    }

    if (routes.length > 0) {
      const companyIds = routes.map(r => r.company_id);

      // 4️⃣ Fetch buses within radius of user location (using straight-line distance for initial filtering only)
      const busResult = await pool.query(`
        SELECT b.id, b.plate_number, b.capacity, b.status,
              bl.latitude, bl.longitude, bl.recorded_at,
              ( 6371 * acos(
                  cos(radians($1)) * cos(radians(bl.latitude))
                  * cos(radians(bl.longitude) - radians($2))
                  + sin(radians($1)) * sin(radians(bl.latitude))
              )) AS straight_line_distance_km
        FROM buses b
        JOIN bus_locations bl ON b.id = bl.bus_id
        WHERE b.status = 'ACTIVE'
          AND b.company_id = ANY($3::uuid[])
          AND ( 6371 * acos(
                  cos(radians($1)) * cos(radians(bl.latitude))
                  * cos(radians(bl.longitude) - radians($2))
                  + sin(radians($1)) * sin(radians(bl.latitude))
              )) <= $4
        ORDER BY straight_line_distance_km ASC
      `, [user_lat, user_lng, companyIds, radius_km]);

      buses = busResult.rows;

      // 5️⃣ Call Gebeta Maps API to get ETA AND ROAD DISTANCE for each bus
      await Promise.all(buses.map(async (bus) => {
        try {
          const response = await axios.get('https://mapapi.gebeta.app/api/route/direction/', {
            params: {
              origin: `${bus.latitude},${bus.longitude}`,
              destination: `${user_lat},${user_lng}`,
              apiKey: GEBETA_API_KEY
            }
          });

          console.log('Gebeta API response for bus', bus.id, response.data);
          
          // Use Gebeta's accurate road distance and time
          bus.eta_minutes = Math.ceil(response.data.timetaken / 60);
          bus.road_distance_km = (response.data.totalDistance / 1000).toFixed(2); // Convert meters to km
          bus.straight_line_distance_km = bus.straight_line_distance_km; // Keep for comparison

        } catch (err) {
          console.error('Gebeta API error for bus', bus.id, err.message);
          bus.eta_minutes = null;
          bus.road_distance_km = null;
        }
      }));
    }

    return res.json({ buses, routes, alternative_routes });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllBuses, searchBusesByRoute };

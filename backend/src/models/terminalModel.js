const pool = require('../config/db');

class Terminal {
  static async getAllTerminals() {
    const query = 'SELECT id, name, latitude, longitude FROM terminals ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Terminal;

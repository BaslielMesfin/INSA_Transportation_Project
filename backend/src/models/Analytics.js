const pool = require('../config/db');

class Analytics {
  // Get system-wide statistics
  static async getSystemStats() {
    const queries = {
      totalCompanies: `SELECT COUNT(*) FROM companies`,
      activeCompanies: `SELECT COUNT(*) FROM companies WHERE status = 'approved'`,
      pendingCompanies: `SELECT COUNT(*) FROM companies WHERE status = 'pending'`,
      totalBuses: `SELECT COUNT(*) FROM buses`,
      activeBuses: `SELECT COUNT(*) FROM buses WHERE status = 'ACTIVE'`,
      totalDrivers: `SELECT COUNT(*) FROM drivers`,
      activeDrivers: `SELECT COUNT(*) FROM drivers WHERE status = 'ACTIVE'`,
      totalPassengers: `SELECT COUNT(*) FROM users WHERE role = 'PASSENGER'`,
      totalRevenue: `SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE status = 'completed'`
    };

    const stats = {};
    
    for (const [key, query] of Object.entries(queries)) {
      const result = await pool.query(query);
      stats[key] = parseInt(result.rows[0].count || result.rows[0].coalesce);
    }

    return stats;
  }

  // Get company performance comparison
  static async getCompanyPerformance() {
    const query = `
      SELECT 
        c.id,
        c.name,
        COUNT(DISTINCT b.id) as total_buses,
        COUNT(DISTINCT d.id) as total_drivers,
        COUNT(DISTINCT r.id) as total_routes,
        COALESCE(SUM(t.amount), 0) as total_revenue
      FROM companies c
      LEFT JOIN buses b ON c.id = b.company_id
      LEFT JOIN drivers d ON c.id = d.company_id
      LEFT JOIN routes r ON c.id = r.company_id
      LEFT JOIN transactions t ON c.id = t.company_id AND t.status = 'completed'
      WHERE c.status = 'approved'
      GROUP BY c.id, c.name
      ORDER BY total_revenue DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Analytics;
const pool = require('../config/db');

class Analytics {
  // Get system-wide statistics
  static async getSystemStats() {
    try {
      const queries = {
        totalCompanies: `SELECT COUNT(*) FROM companies`,
        activeCompanies: `SELECT COUNT(*) FROM companies WHERE status = 'approved'`,
        pendingCompanies: `SELECT COUNT(*) FROM companies WHERE status = 'pending'`,
        rejectedCompanies: `SELECT COUNT(*) FROM companies WHERE status = 'rejected'`,
        suspendedCompanies: `SELECT COUNT(*) FROM companies WHERE status = 'suspended'`,
        totalBuses: `SELECT COUNT(*) FROM buses`,
        activeBuses: `SELECT COUNT(*) FROM buses WHERE status = 'ACTIVE'`,
        inactiveBuses: `SELECT COUNT(*) FROM buses WHERE status = 'INACTIVE'`,
        maintenanceBuses: `SELECT COUNT(*) FROM buses WHERE status = 'MAINTENANCE'`,
        totalDrivers: `SELECT COUNT(*) FROM users WHERE role = 'DRIVER'`,
        totalPassengers: `SELECT COUNT(*) FROM users WHERE role = 'PASSENGER'`,
        totalCompanyAdmins: `SELECT COUNT(*) FROM users WHERE role = 'COMPANY_ADMIN'`,
        totalSuperAdmins: `SELECT COUNT(*) FROM users WHERE role = 'SUPER_ADMIN'`,
        totalRoutes: `SELECT COUNT(*) FROM routes`,
        activeRoutes: `SELECT COUNT(*) FROM routes WHERE is_active = true`,
        totalTerminals: `SELECT COUNT(*) FROM terminals`,
        totalBusHails: `SELECT COUNT(*) FROM bus_hails`,
        pendingBusHails: `SELECT COUNT(*) FROM bus_hails WHERE status = 'PENDING'`
      };

      const stats = {};
      
      for (const [key, query] of Object.entries(queries)) {
        try {
          const result = await pool.query(query);
          // Handle different return types from queries
          const value = result.rows[0];
          stats[key] = parseInt(value.count || value.coalesce || Object.values(value)[0] || 0);
        } catch (error) {
          console.warn(`Query failed for ${key}:`, error.message);
          stats[key] = 0; // Default to 0 if query fails
        }
      }

      // Add revenue (set to 0 since we don't have transactions table yet)
      stats.totalRevenue = 0;

      return stats;
    } catch (error) {
      console.error('Error in getSystemStats:', error);
      throw error;
    }
  }

  // Get company performance comparison
  static async getCompanyPerformance() {
    try {
      const query = `
        SELECT 
          c.id,
          c.name,
          c.status,
          COUNT(DISTINCT b.id) as total_buses,
          COUNT(DISTINCT b.id) FILTER (WHERE b.status = 'ACTIVE') as active_buses,
          COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'DRIVER') as total_drivers,
          COUNT(DISTINCT r.id) as total_routes,
          COUNT(DISTINCT r.id) FILTER (WHERE r.is_active = true) as active_routes,
          0 as total_revenue -- Placeholder until we have transactions table
        FROM companies c
        LEFT JOIN buses b ON c.id = b.company_id
        LEFT JOIN users u ON c.id = u.company_id
        LEFT JOIN routes r ON c.id = r.company_id
        GROUP BY c.id, c.name, c.status
        ORDER BY total_buses DESC, total_drivers DESC
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error in getCompanyPerformance:', error);
      throw error;
    }
  }

  // Get recent activity stats
  static async getRecentActivity() {
    try {
      const queries = {
        recentCompanies: `
          SELECT name, created_at, status 
          FROM companies 
          ORDER BY created_at DESC 
          LIMIT 5
        `,
        recentBuses: `
          SELECT b.plate_number, c.name as company_name, b.created_at 
          FROM buses b 
          JOIN companies c ON b.company_id = c.id 
          ORDER BY b.created_at DESC 
          LIMIT 5
        `,
        recentBusHails: `
          SELECT bh.status, t1.name as start_terminal, t2.name as end_terminal, bh.created_at 
          FROM bus_hails bh
          JOIN terminals t1 ON bh.start_terminal_id = t1.id
          JOIN terminals t2 ON bh.end_terminal_id = t2.id
          ORDER BY bh.created_at DESC 
          LIMIT 5
        `
      };

      const activity = {};
      
      for (const [key, query] of Object.entries(queries)) {
        try {
          const result = await pool.query(query);
          activity[key] = result.rows;
        } catch (error) {
          console.warn(`Query failed for ${key}:`, error.message);
          activity[key] = []; // Empty array if query fails
        }
      }

      return activity;
    } catch (error) {
      console.error('Error in getRecentActivity:', error);
      throw error;
    }
  }
}

module.exports = Analytics;
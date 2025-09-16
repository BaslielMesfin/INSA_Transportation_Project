const pool = require('../config/db');

class Company {
  static async getAllCompanies(filters = {}) {
    try {
      let query = `
        SELECT 
          c.id,
          c.name,
          c.registration_no,
          c.address,
          c.status,
          c.approval_date,
          c.approved_by,
          COUNT(DISTINCT b.id) as bus_count,
          COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'DRIVER') as driver_count,
          admin_user.name as approved_by_name
        FROM companies c
        LEFT JOIN buses b ON c.id = b.company_id
        LEFT JOIN users u ON c.id = u.company_id
        LEFT JOIN users admin_user ON c.approved_by = admin_user.id
      `;

      const whereClauses = [];
      const values = [];
      let paramCount = 0;

      if (filters.status) {
        paramCount++;
        whereClauses.push(`c.status = $${paramCount}`);
        values.push(filters.status);
      }

      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
      }

      query += `
        GROUP BY 
          c.id, c.name, c.registration_no, c.address, c.status, 
          c.approval_date, c.approved_by, admin_user.name
        ORDER BY c.created_at DESC
      `;

      console.log('Executing query:', query);
      console.log('With values:', values);

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error in getAllCompanies:', error);
      throw error;
    }
  }

  static async updateCompanyStatus(companyId, status, approvedBy) {
    try {
      const query = `
        UPDATE companies 
        SET status = $1, approval_date = NOW(), approved_by = $2, updated_at = NOW()
        WHERE id = $3 
        RETURNING *
      `;
      console.log('Updating company status:', { companyId, status, approvedBy });
      
      const result = await pool.query(query, [status, approvedBy, companyId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateCompanyStatus:', error);
      throw error;
    }
  }

  static async getCompanyDetails(companyId) {
    try {
      const query = `
        SELECT 
          c.*,
          (SELECT COUNT(*) FROM buses WHERE company_id = $1 AND status = 'ACTIVE') as active_buses,
          (SELECT COUNT(*) FROM users WHERE company_id = $1 AND role = 'DRIVER') as total_drivers,
          (SELECT COUNT(*) FROM routes WHERE company_id = $1) as total_routes,
          u.name as approved_by_name
        FROM companies c
        LEFT JOIN users u ON c.approved_by = u.id
        WHERE c.id = $1
      `;
      console.log('Getting company details for:', companyId);
      
      const result = await pool.query(query, [companyId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getCompanyDetails:', error);
      throw error;
    }
  }

  static async findById(companyId) {
    try {
      const query = 'SELECT * FROM companies WHERE id = $1';
      const result = await pool.query(query, [companyId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }
}

module.exports = Company;
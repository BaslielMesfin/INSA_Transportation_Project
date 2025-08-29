const pool = require('../config/db');

class Company {
  static async getAllCompanies(filters = {}) {
    let query = `
      SELECT 
        c.id, c.name, c.registration_no, c.address, c.status,
        c.approval_date, c.approved_by,
        COUNT(b.id) as bus_count,
        COUNT(d.id) as driver_count,
        u.name as approved_by_name
      FROM companies c
      LEFT JOIN buses b ON c.id = b.company_id
      LEFT JOIN drivers d ON c.id = d.company_id
      LEFT JOIN users u ON c.approved_by = u.id
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

    query += ` GROUP BY c.id, u.name ORDER BY c.name ASC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async updateCompanyStatus(companyId, status, approvedBy) {
    const query = `
      UPDATE companies 
      SET status = $1, approval_date = NOW(), approved_by = $2
      WHERE id = $3 
      RETURNING *
    `;
    const result = await pool.query(query, [status, approvedBy, companyId]);
    return result.rows[0];
  }

  static async getCompanyDetails(companyId) {
    const query = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM buses WHERE company_id = $1 AND status = 'ACTIVE') as active_buses,
        (SELECT COUNT(*) FROM drivers WHERE company_id = $1 AND status = 'ACTIVE') as active_drivers,
        (SELECT COUNT(*) FROM routes WHERE company_id = $1) as total_routes,
        u.name as approved_by_name
      FROM companies c
      LEFT JOIN users u ON c.approved_by = u.id
      WHERE c.id = $1
    `;
    const result = await pool.query(query, [companyId]);
    return result.rows[0];
  }
}

module.exports = Company;
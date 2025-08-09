const { Pool } = require('pg');

// Create a new connection pool to your PostgreSQL database
const pool = new Pool({
  user: 'postgres',               // your PostgreSQL user
  host: 'localhost',              // where your database runs
  database: 'spts',               // your database name
  password: 'postgresqluser2025**', // your PostgreSQL password
  port: 5432,                    // default Postgres port
});

module.exports = pool;

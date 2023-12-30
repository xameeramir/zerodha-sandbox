const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'db_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zerodha_db',
  password: process.env.DB_PASSWORD || 'zerodha_password',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000, 
});

module.exports = pool;

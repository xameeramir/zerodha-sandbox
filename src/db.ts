const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'db_user',
  host: process.env.DB_HOST || '192.168.17.14',
  database: process.env.DB_NAME || 'zerodha_db',
  password: process.env.DB_PASSWORD || 'zerodha_password',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5422,
    idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000, 
});

async function initializeDBConnection() {
  try {
    const client = await pool.connect();
    console.log("Connected to the database successfully");
    client.release();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Exit the process with an error code
  }
}

initializeDBConnection();

module.exports = pool;

// Shutdown function to gracefully release the pool
function shutdown() {
  console.log('Shutting down the application...');
  pool.end(() => {
    console.log('Pool has been closed.');
    process.exit(0);
  });
}

// Capture application termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Optionally, you can handle uncaught exceptions and promise rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', promise, 'reason:', reason);
  shutdown();
});
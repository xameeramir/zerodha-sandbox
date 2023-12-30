import { router } from "./router";

const express = require('express');
const server = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const pool = require('./db');
import { generateRandomOrders } from './Orders/orders'
const createOrdersTable = async () => {
    try {
      const client = await pool.connect();
        // If no entries exist, create the table and generate random orders
        await client.query(`
          CREATE TABLE IF NOT EXISTS orders (
            order_id VARCHAR(50) PRIMARY KEY,
            parent_order_id VARCHAR(50),
            exchange_order_id VARCHAR(50),
            placed_by VARCHAR(50),
            variety VARCHAR(50),
            status VARCHAR(50),
            tradingsymbol VARCHAR(50),
            exchange VARCHAR(50),
            instrument_token INTEGER,
            transaction_type VARCHAR(50),
            order_type VARCHAR(50),
            product VARCHAR(50),
            validity VARCHAR(50),
            price NUMERIC,
            quantity INTEGER,
            trigger_price NUMERIC,
            average_price NUMERIC,
            pending_quantity INTEGER,
            filled_quantity INTEGER,
            disclosed_quantity INTEGER,
            market_protection INTEGER,
            order_timestamp TIMESTAMP,
            exchange_timestamp TIMESTAMP,
            status_message TEXT,
            tag VARCHAR(50)
          )
        `);
        const checkExistingOrders = await client.query('SELECT COUNT(1) FROM orders');
        const existingOrdersCount = parseInt(checkExistingOrders.rows[0].count, 10);
        if (existingOrdersCount === 0) {
        // Generate random orders
        const ordersData = generateRandomOrders(10); // Change the count as needed
  
        // Insert initial orders data into the table
        for (const orderData of ordersData) {
          await client.query(`
            INSERT INTO orders (${Object.keys(orderData).join(', ')})
            VALUES (${Object.values(orderData).map((_, idx) => `$${idx + 1}`).join(', ')})
          `, Object.values(orderData));
        }
  
        console.log('Orders table created and initial data inserted successfully.');
      } else {
        console.log('Orders table already contains data. Skipping creation and insertion.');
      }
  
      client.release();
    } catch (error) {
      console.error('Error creating orders table:', error);
    }
  };
  
createOrdersTable(); // Initialize the orders table when the server starts

  const createGTTTriggersTable = async () => {
    try {
      const client = await pool.connect();
  
      // Check if the gtt_triggers table exists
      const checkTableQuery = 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)';
      const tableExists = await client.query(checkTableQuery, ['gtt_triggers']);
  
      if (!tableExists.rows[0].exists) {
        // If the table doesn't exist, create the table
        await client.query(`
          CREATE TABLE IF NOT EXISTS gtt_triggers (
            trigger_id SERIAL PRIMARY KEY,
            type VARCHAR(50),
            condition JSONB,
            orders JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
  
        // Insert trigger data
        const triggerData = {
          type: 'single',
          condition: {
            exchange: 'NSE',
            tradingsymbol: 'INFY',
            trigger_values: [702.0],
            last_price: 798.0
          },
          orders: [
            {
              exchange: 'NSE',
              tradingsymbol: 'INFY',
              transaction_type: 'BUY',
              quantity: 1,
              order_type: 'LIMIT',
              product: 'CNC',
              price: 702.5
            }
          ]
        };
  
        // Insert initial trigger data into the gtt_triggers table
        await client.query(`
          INSERT INTO gtt_triggers (type, condition, orders)
          VALUES ($1, $2, $3)
        `, [triggerData.type, triggerData.condition, triggerData.orders]);
  
        console.log('GTT Triggers table created and initial data inserted successfully.');
      } else {
        console.log('GTT Triggers table already exists. Skipping creation and insertion.');
      }
  
      client.release();
    } catch (error) {
      console.error('Error creating GTT Triggers table:', error);
    }
  };
  
  createGTTTriggersTable(); // Initialize the GTT Triggers table when the server starts

  const createPortfolioPositionsTable = async () => {
    try {
      const client = await pool.connect();
  
      // Check if the portfolio_positions table exists
      const checkTableQuery = 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)';
      const tableExists = await client.query(checkTableQuery, ['portfolio_positions']);
  
      if (!tableExists.rows[0].exists) {
        // If the table doesn't exist, create the table
        await client.query(`
          CREATE TABLE IF NOT EXISTS portfolio_positions (
            position_id SERIAL PRIMARY KEY,
            order_id VARCHAR(50) REFERENCES orders(order_id),
            average_price NUMERIC,
            close_price NUMERIC,
            value NUMERIC,
            pnl NUMERIC,
            m2m NUMERIC,
            unrealised NUMERIC,
            realised NUMERIC,
            authorised_quantity NUMERIC DEFAULT 0,
            authorised_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
  
        console.log('Portfolio Positions table created successfully.');
      } else {
        console.log('Portfolio Positions table already exists. Skipping creation.');
      }
  
      client.release();
    } catch (error) {
      console.error('Error creating Portfolio Positions table:', error);
    }
  };
  
  
  
  createPortfolioPositionsTable(); // Initialize the Portfolio Positions table

  const createPortfolioHoldingsTable = async () => {
    try {
      const client = await pool.connect();
  
      // Check if the portfolio_holdings table exists
      const checkTableQuery = 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)';
      const tableExists = await client.query(checkTableQuery, ['portfolio_holdings']);
  
      if (!tableExists.rows[0].exists) {
        // If the table doesn't exist, create the table
        await client.query(`
        CREATE TABLE IF NOT EXISTS portfolio_holdings (
          holding_id SERIAL PRIMARY KEY,
          order_id VARCHAR(50) REFERENCES orders(order_id),
          average_price NUMERIC,
          close_price NUMERIC,
          pnl NUMERIC,
          day_change NUMERIC,
          day_change_percentage NUMERIC,
          authorised_quantity NUMERIC DEFAULT 0,
          authorised_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
  
        console.log('Portfolio Holdings table created successfully.');
      } else {
        console.log('Portfolio Holdings table already exists. Skipping creation.');
      }
  
      client.release();
    } catch (error) {
      console.error('Error creating Portfolio Holdings table:', error);
    }
  };
  
  
  createPortfolioHoldingsTable(); // Initialize the Portfolio Holdings table when the server starts

server.use(express.json());
router(server);

const path = require('path');
const publicFolder = path.join(__dirname, '../');
server.get('/', function (req: any, res: any) {
    res.sendFile(path.join(publicFolder, 'index.html'));
});
server.use('/', express.static(publicFolder));

server.use(cors());
server.listen(port, () => {

    console.log(`
Mock server is running at PORT ${port}\n
Free sandbox for testing Zerodha's Kite and Coin APIs\n
Learn more https://nordible.com/zerodha-sandbox/\n
\u00a9 nordible ${new Date().getFullYear()}`);
});
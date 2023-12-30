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
  
      // Check if the orders table is empty
      const checkExistingOrders = await client.query('SELECT COUNT(*) FROM orders');
      const existingOrdersCount = parseInt(checkExistingOrders.rows[0].count, 10);
  
      if (existingOrdersCount === 0) {
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
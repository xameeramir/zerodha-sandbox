import { router } from "./router";
const path = require('path');
const fs = require('fs');
const express = require('express');
const server = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const pool = require('./db');
const bodyParser = require('body-parser');
import { generateRandomOrders } from './Orders/orders'

const createUserTableAndInsertData = async (client: any) => {
  try {
    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        user_type VARCHAR(50),
        email VARCHAR(100),
        user_name VARCHAR(50),
        user_shortname VARCHAR(50),
        broker VARCHAR(50),
        exchanges TEXT[],
        products TEXT[],
        order_types TEXT[],
        avatar_url VARCHAR(255),
        api_key VARCHAR(100),
        api_secret VARCHAR(100),
        access_token VARCHAR(100),
        public_token VARCHAR(100),
        enctoken VARCHAR(100),
        refresh_token VARCHAR(100),
        silo VARCHAR(50),
        login_time TIMESTAMP
      )
    `);

    // Check if the table already contains data
    const checkExistingUsers = await client.query('SELECT COUNT(1) FROM users');
    const existingUsersCount = parseInt(checkExistingUsers.rows[0].count, 10);

    if (existingUsersCount === 0) {
      // Insert a sample user entry
      const sampleUserData = {
        id: 'HQ6420',
        user_type: 'individual',
        email: 'sample@example.com',
        user_name: 'Sample User',
        user_shortname: 'Sample',
        broker: 'ZERODHA',
        exchanges: ['NSE', 'NFO', 'BFO', 'CDS', 'BSE', 'MCX', 'BCD', 'MF'],
        products: ['CNC', 'NRML', 'MIS', 'BO', 'CO'],
        order_types: ['MARKET', 'LIMIT', 'SL', 'SL-M'],
        avatar_url: 'abc',
        api_key: 'SampleAPIKey',
        api_secret: 'SampleAPISecret',
        access_token: 'SampleAccessToken',
        public_token: 'SamplePublicToken',
        enctoken: 'SampleEncToken',
        refresh_token: '',
        silo: '',
        login_time: '2021-01-01 16:15:14'
      };

      // Insert sample user data into the table
      await client.query(`
        INSERT INTO users (${Object.keys(sampleUserData).join(', ')})
        VALUES (${Object.values(sampleUserData).map((_, idx) => `$${idx + 1}`).join(', ')})
      `, Object.values(sampleUserData));

      console.log('Users table created and sample data inserted successfully.');
    } else {
      console.log('Users table already contains data. Skipping creation and insertion.');
    }
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};
async function checkInstrumentsTable(client: any) {
  try {
    const tableCheckQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'instruments'
      )
    `;

    const result = await client.query(tableCheckQuery);
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error checking table existence:', error);
    return false;
  }
}
// Function to create the instruments table
async function createInstrumentsTable(client: any) {
  try {
    const tableExists = await checkInstrumentsTable(client);
    if (!tableExists) {
      const createTableQuery = `
        CREATE TABLE instruments (
          instrument_token SERIAL PRIMARY KEY,
          exchange_token INTEGER,
          tradingsymbol VARCHAR(255),
          name VARCHAR(255),
          last_price FLOAT,
          expiry DATE,
          strike FLOAT,
          tick_size FLOAT,
          lot_size INTEGER,
          instrument_type VARCHAR(255),
          segment VARCHAR(255),
          exchange VARCHAR(255)
        )
      `;

      await client.query(createTableQuery);
      console.log('Instruments table created successfully.');
    } else {
      console.log('Instruments table already exists.');
    }

    // Check if the table has entries
    const tableEntriesQuery = 'SELECT COUNT(*) FROM instruments';
    const entriesResult = await client.query(tableEntriesQuery);
    const entriesCount = parseInt(entriesResult.rows[0].count, 10);

    if (entriesCount > 0) {
      console.log('Instruments table already contains entries.');
    } else {
      // Import data from the SQL file
      const filePath = path.join(__dirname, '../dumps', 'instruments.sql');
      const sql = fs.readFileSync(filePath).toString();

      await client.query(sql);
      console.log('Data imported successfully.');
    }
  } catch (error) {
    console.error('Error creating table or importing data:', error);
  }
}

const createOrdersTable = async (client: any) => {
    try {
        // If no entries exist, create the table and generate random orders
        await client.query(`
          CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            user_id VARCHAR(50) REFERENCES users(id),
            parent_order_id INTEGER,
            exchange_order_id INTEGER,
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
        const ordersData = await generateRandomOrders(10, client);
  
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
    } catch (error) {
      console.error('Error creating orders table:', error);
    }
  };
  
  const createGTTTriggersTable = async (client: any) => {
    try {
  
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
    } catch (error) {
      console.error('Error creating GTT Triggers table:', error);
    }
  };

  const createPortfolioPositionsTable = async (client: any) => {
    try {
      // Check if the portfolio_positions table exists
      const checkTableQuery = 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)';
      const tableExists = await client.query(checkTableQuery, ['portfolio_positions']);
  
      if (!tableExists.rows[0].exists) {
        // If the table doesn't exist, create the table
        await client.query(`
          CREATE TABLE IF NOT EXISTS portfolio_positions (
            position_id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id),
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
    } catch (error) {
      console.error('Error creating Portfolio Positions table:', error);
    }
  };
  
  const createPortfolioHoldingsTable = async (client: any) => {
    try {
      // Check if the portfolio_holdings table exists
      const checkTableQuery = 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)';
      const tableExists = await client.query(checkTableQuery, ['portfolio_holdings']);
  
      if (!tableExists.rows[0].exists) {
        // If the table doesn't exist, create the table
        await client.query(`
        CREATE TABLE IF NOT EXISTS portfolio_holdings (
          holding_id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id),
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
    } catch (error) {
      console.error('Error creating Portfolio Holdings table:', error);
    }
  };
  const performDatabaseOperations = async () => {
    let client;
    try {
      client = await pool.connect();
      await createInstrumentsTable(client);
      await createGTTTriggersTable(client);
      await createUserTableAndInsertData(client);
      await createOrdersTable(client);
      await createPortfolioPositionsTable(client);
      await createPortfolioHoldingsTable(client);
      // Set up the server and other functionalities after all database operations are done
      server.use(bodyParser.urlencoded({ extended: true }));
      router(server);
      const path = require('path');
      const publicFolder = path.join(__dirname, '../');
      server.use(express.static(path.join(__dirname, '../')));
      server.get('/', (req: any, res: any) => {
        res.sendFile(path.join(__dirname, '../index.html'));
      });
      server.use('/', express.static(publicFolder));
      server.use(cors());
      server.listen(port, () => {
        console.log(`Mock server is running at PORT ${port}\nFree sandbox for testing Zerodha's Kite and Coin APIs\nLearn more https://nordible.com/zerodha-sandbox/\n\u00a9 nordible ${new Date().getFullYear()}`);
      });
    } catch (error) {
      console.error('Error performing database operations:', error);
    } finally {
      if (client) {
        ;
        console.log('Database client released.');
      }
    }
  };
  
  // Call the function to perform all database operations and start the server
  performDatabaseOperations()
    .catch((err) => console.error('Error:', err));
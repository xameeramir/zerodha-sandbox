const faker = require('faker');
const pool = require('../db');
const axios = require('axios');

// Function to generate random order ID
const generateRandomOrderID = (): string => {
  return faker.datatype.number().toString();
};

export const POSTOrderVariety = async (request: any, response: any) => {
  try {
    const { authorization } = request.headers;
    // Extract user_id from the authorization header or token
    const tokenParts = authorization.split(' ');
    const [apiKey, accessToken] = tokenParts[tokenParts.length - 1].split(':');

    const client = await pool.connect();

     // Fetch user_id based on the provided api_key and access_token
     const userQuery = await client.query(
      'SELECT id FROM users WHERE api_key = $1 AND access_token = $2',
      [apiKey, accessToken]
    );
    const user = userQuery.rows[0];

    if (!user) {
      response.status(401).jsonp({
        "status": "error",
        "message": "Unauthorized access",
      });
      client.release();
      return;
    }
    const {
      tradingsymbol,
      exchange,
      transaction_type,
      order_type,
      quantity,
      product,
      validity
    } = request.body;
    const { variety } = request.params; // Fetch variety from route params

    // Generate a random price based on the variety using Faker
    const price = faker.datatype.number({ min: 1, max: 100 });

    const orderID = generateRandomOrderID();

    // Insert order details into the database

    await client.query(
      `
      INSERT INTO orders (
        id,
        user_id,
        tradingsymbol, 
        exchange, 
        transaction_type, 
        order_type, 
        quantity, 
        product, 
        validity, 
        status, 
        variety, 
        price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `,
      [
        orderID,
        user.id,
        tradingsymbol,
        exchange,
        transaction_type,
        order_type,
        quantity,
        product,
        validity,
        'ACCEPTED',
        variety,
        price,
      ]
    );
    client.release();
    // After inserting the order, call the function to calculate and insert positions
    await calculateAndInsertPositions(client, orderID);

    response.status(200).jsonp({
      "status": "success",
      "data": {
        "order_id": orderID
      }
    });
  } catch (error) {
    console.error('Error placing order:', error);
    response.status(500).jsonp({
      "status": "error",
      "message": "Error placing order"
    });
  }
};


// Assuming 'pool' is previously defined for database operations

export const PUTOrderVariety = async (request: any, response: any) => {
  try {
    const orderID = request.params.orderId;
    const {
      order_type,
      quantity,
      price,
      trigger_price,
      disclosed_quantity,
      validity
    } = request.body; 

    // Update order details in the database
    const client = await pool.connect();

    await client.query(`
      UPDATE orders 
      SET order_type = $1, quantity = $2, price = $3, trigger_price = $4, disclosed_quantity = $5, validity = $6
      WHERE id = $7
    `, [order_type, quantity, price, trigger_price, disclosed_quantity, validity, orderID]);

    client.release();

    await calculateAndInsertPositions(client, orderID);

    response.status(200).jsonp({
      "status": "success",
      "data": {
        "order_id": orderID
      }
    });
  } catch (error) {
    console.error('Error modifying order:', error);
    response.status(500).jsonp({
      "status": "error",
      "message": "Error modifying order"
    });
  }
};
// Function to handle DELETE request for DELETEOrderVariety
export const DELETEOrderVariety = (request: any, response: any) => {
  const orderID = generateRandomOrderID(); // Generating random order ID
  response.status(200).jsonp({
    "status": "success",
    "data": {
      "order_id": orderID
    }
  });
};


// Function to calculate and insert positions
const calculateAndInsertPositions = async (client: any, orderID: any) => {
  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Check if there's an existing position for the given instrument_token
    const positionCheckQuery = `
      SELECT COUNT(*) AS count
      FROM portfolio_positions
      WHERE instrument_token = (
        SELECT instrument_token
        FROM orders
        WHERE id = $1
      )
    `;
    const positionCheckResult = await client.query(positionCheckQuery, [orderID]);

    const positionExists = positionCheckResult.rows[0].count > 0;

    if (positionExists) {
      // Update existing position based on instrument_token
      const updateQuery = `
        UPDATE portfolio_positions AS pp
        SET
          average_price = (
            SELECT AVG(o.price)
            FROM orders AS o
            WHERE o.instrument_token = pp.instrument_token
          ),
          close_price = (
            SELECT MAX(o.price)
            FROM orders AS o
            WHERE o.instrument_token = pp.instrument_token
          ),
          value = (
            SELECT SUM(o.price * o.quantity)
            FROM orders AS o
            WHERE o.instrument_token = pp.instrument_token
          ),
          pnl = (
            SELECT SUM(CASE
              WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
              ELSE 0
            END)
            FROM orders AS o
            WHERE o.instrument_token = pp.instrument_token
          ),
          m2m = (
            SELECT SUM(CASE
              WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
              ELSE 0
            END)
            FROM orders AS o
            WHERE o.instrument_token = pp.instrument_token
          ),
          unrealised = (
            SELECT SUM(CASE
              WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
              ELSE 0
            END)
            FROM orders AS o
            WHERE o.instrument_token = pp.instrument_token
          ),
          realised = (
            SELECT SUM(CASE
              WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
              ELSE 0
            END)
            FROM orders AS o
            WHERE o.instrument_token = pp.instrument_token
          )
        WHERE pp.instrument_token = (
          SELECT instrument_token
          FROM orders
          WHERE id = $1
        )
      `;

      await client.query(updateQuery, [orderID]);
    } else {
      // Insert new position for the instrument_token
      const insertQuery = `
        INSERT INTO portfolio_positions (
          instrument_token,
          average_price,
          close_price,
          value,
          pnl,
          m2m,
          unrealised,
          realised
        )
        SELECT
          o.instrument_token,
          AVG(o.price) AS average_price,
          MAX(o.price) AS close_price,
          SUM(o.price * o.quantity) AS value,
          SUM(CASE
            WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
            ELSE 0
          END) AS pnl,
          SUM(CASE
            WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
            ELSE 0
          END) AS m2m,
          SUM(CASE
            WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
            ELSE 0
          END) AS unrealised,
          SUM(CASE
            WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price)
            ELSE 0
          END) AS realised
        FROM
          orders o
        WHERE
          o.id = $1
        GROUP BY
          o.instrument_token
      `;

      await client.query(insertQuery, [orderID]);
    }
    await client.query('COMMIT');

    console.log(`Positions calculated and inserted/updated for order_id: ${orderID} successfully.`);
  } catch (error) {
    console.error(`Error calculating and inserting/updating positions for order_id: ${orderID}`, error);
  }
};


function simulateDelayedPostback(orderId: any) {
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  setTimeout(() => {
    const updatedStatusPayload = {
      user_id: "AB1234",
      unfilled_quantity: 0,
      app_id: 1234,
      order_id: orderId, // Using the provided order ID
      status: "COMPLETE", // Simulating an updated status as "COMPLETE"
    };
    sendPostbackUpdate(updatedStatusPayload);
  }, fiveMinutes);
}

// Function to calculate SHA-256 checksum using Web Crypto API
async function calculateChecksum(orderId: any, orderTimestamp: any, apiSecret: any) {
  const encoder = new TextEncoder();
  const data = encoder.encode(orderId + orderTimestamp + apiSecret);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => ('00' + byte.toString(16)).slice(-2)).join('');

  return hashHex;
}

// Function to send a POST request with the payload
function sendPostbackUpdate(payload: any) {
  // Your API endpoint URL
  const apiUrl = 'http://localhost:8000/api/z-postback';
  const apiSecret = 'your_api_secret'; 

  // Calculate checksum using payload data
  const { order_id: orderId, order_timestamp: orderTimestamp } = payload;
  const checksum = calculateChecksum(orderId, orderTimestamp, apiSecret);

  payload.checksum = checksum;
  axios.post(apiUrl, payload)
    .then((response: { data: any; }) => {
      console.log('Postback sent successfully:', response.data);
    })
    .catch((error: any) => {
      console.error('Error sending postback:', error);
    });
}


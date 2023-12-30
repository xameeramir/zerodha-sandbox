const faker = require('faker');
const pool = require('../db');
const axios = require('axios');

// Function to generate random order ID
const generateRandomOrderID = (): string => {
  return faker.datatype.number().toString();
};

export const POSTOrderVariety = async (request: any, response: any) => {
  try {
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
    const client = await pool.connect();

    await client.query(
      `
      INSERT INTO orders (
        order_id, 
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [
        orderID,
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
      WHERE order_id = $7
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

    // Calculate and insert data into positions table for a specific order_id
    const insertQuery = `
      INSERT INTO portfolio_positions (
        order_id,
        average_price,
        close_price,
        value,
        pnl,
        m2m,
        unrealised,
        realised
      )
      SELECT
        o.order_id,
        -- Replace with your calculation logic for average_price, close_price, value, pnl, m2m, unrealised, realised
        AVG(o.price) AS average_price,
        MAX(o.price) AS close_price,
        SUM(o.price * o.quantity) AS value,
        SUM(CASE WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price) ELSE 0 END) AS pnl,
        SUM(CASE WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price) ELSE 0 END) AS m2m,
        SUM(CASE WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price) ELSE 0 END) AS unrealised,
        SUM(CASE WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price) ELSE 0 END) AS realised
      FROM
        orders o
      WHERE
        o.order_id = $1
      GROUP BY
        o.order_id
    `;

    // Execute the insert query with the specified order_id
    await client.query(insertQuery, [orderID]);

    // Commit the transaction
    await client.query('COMMIT');

    console.log(`Positions calculated and inserted for order_id: ${orderID} successfully.`);
  } catch (error) {
    console.error(`Error calculating and inserting positions for order_id: ${orderID}`, error);
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


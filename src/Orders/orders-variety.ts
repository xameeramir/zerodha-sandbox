const faker = require('faker');
const pool = require('../db');
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
    const orderID = request.params.orderId; // Assuming the order ID is passed in the request URL
    const {
      order_type,
      quantity,
      price,
      trigger_price,
      disclosed_quantity,
      validity,
      // other relevant parameters as needed from the request
    } = request.body; // Assuming request contains the necessary parameters to modify the order

    // Update order details in the database
    const client = await pool.connect();

    await client.query(`
      UPDATE orders 
      SET order_type = $1, quantity = $2, price = $3, trigger_price = $4, disclosed_quantity = $5, validity = $6
      WHERE order_id = $7
    `, [order_type, quantity, price, trigger_price, disclosed_quantity, validity, orderID]);

    client.release();

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

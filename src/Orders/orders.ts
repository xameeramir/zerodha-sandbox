const faker = require('faker');
const pool = require('../db');
// Function to generate random orders data
export const generateRandomOrders = (count: number): any[] => {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const order = {
      order_id: faker.datatype.number().toString(),
      parent_order_id: faker.datatype.number().toString(),
      exchange_order_id: null,
      placed_by: faker.random.arrayElement(['SYSTEM', 'USER']),
      variety: 'regular',
      status: faker.random.arrayElement(['REJECTED', 'ACCEPTED', 'CANCELLED', 'COMPLETE']),
      tradingsymbol: faker.random.alphaNumeric(6),
      exchange: faker.random.arrayElement(['NSE', 'BSE']),
      instrument_token: faker.datatype.number(),
      transaction_type: faker.random.arrayElement(['BUY', 'SELL']),
      order_type: 'MARKET',
      product: 'NRML',
      validity: 'DAY',

      price: parseFloat(faker.finance.amount()),
      quantity: faker.datatype.number(),
      trigger_price: parseFloat(faker.finance.amount()),

      average_price: parseFloat(faker.finance.amount()),
      pending_quantity: faker.datatype.number(),
      filled_quantity: faker.datatype.number(),
      disclosed_quantity: faker.datatype.number(),
      market_protection: faker.datatype.number(),

      order_timestamp: faker.date.past().toISOString(),
      exchange_timestamp: null,

      status_message: faker.lorem.sentence(),
      tag: null,
    };
    orders.push(order);
  }
  return orders;
};

// Function to generate random orders data and insert into the database
export const generateAndInsertRandomOrders = async (count: number) => {
  try {
    const client = await pool.connect();

    for (let i = 0; i < count; i++) {
      const order = {
        order_id: faker.datatype.number().toString(),
        parent_order_id: faker.datatype.number().toString(),
        exchange_order_id: null,
        placed_by: faker.random.arrayElement(['SYSTEM', 'USER']),
        variety: 'regular',
        status: faker.random.arrayElement(['REJECTED', 'ACCEPTED', 'CANCELLED', 'COMPLETE']),

        tradingsymbol: faker.random.alphaNumeric(6),
        exchange: faker.random.arrayElement(['NSE', 'BSE']),
        instrument_token: faker.datatype.number(),
        transaction_type: faker.random.arrayElement(['BUY', 'SELL']),
        order_type: 'MARKET',
        product: 'NRML',
        validity: 'DAY',

        price: parseFloat(faker.finance.amount()),
        quantity: faker.datatype.number(),
        trigger_price: parseFloat(faker.finance.amount()),

        average_price: parseFloat(faker.finance.amount()),
        pending_quantity: faker.datatype.number(),
        filled_quantity: faker.datatype.number(),
        disclosed_quantity: faker.datatype.number(),
        market_protection: faker.datatype.number(),

        order_timestamp: faker.date.past().toISOString(),
        exchange_timestamp: null,

        status_message: faker.lorem.sentence(),
        tag: null,
      };

      // Insert the generated order into the database
      await client.query(`
        INSERT INTO orders (${Object.keys(order).join(', ')})
        VALUES (${Object.values(order).map((_, idx) => `$${idx + 1}`).join(', ')})
      `, Object.values(order));
    }

    client.release();
    console.log(`${count} orders inserted into the database.`);
  } catch (error) {
    console.error('Error inserting orders into the database:', error);
  }
};

// Function to handle GET requests for a specified number of random orders
export const GETOrders = async (request: any, response: any) => {
  try {
    const { count } = request.query; // count is provided as a query parameter
    const ordersCount = count ? parseInt(count) : 3; // Default to 3 orders if count is not provided or invalid
    const client = await pool.connect();

    // Fetch specified number of random orders from the database
    const result = await client.query('SELECT * FROM orders ORDER BY RANDOM() LIMIT $1', [ordersCount]);

    client.release();

    response.status(200).jsonp({
      "status": "success",
      "data": result.rows,
    });
  } catch (error) {
    response.status(500).jsonp({
      "status": "error",
      "message": "Failed to fetch orders",
    });
  }
};

// Function to generate random data for GETOrderById
const generateRandomOrderByIdData = (): any[] => {
  const data = [
    {
      average_price: faker.finance.amount(),
      cancelled_quantity: faker.datatype.number(),
      disclosed_quantity: faker.datatype.number(),
      exchange: 'NSE',
      exchange_order_id: null,
      exchange_timestamp: null,
      filled_quantity: faker.datatype.number(),
      instrument_token: faker.datatype.number(),
      market_protection: faker.datatype.number(),
      order_id: faker.datatype.number().toString(),
      order_timestamp: faker.date.past().toISOString(),
      order_type: 'SL',
      parent_order_id: null,
      pending_quantity: faker.datatype.number(),
      placed_by: faker.random.alphaNumeric(6),
      price: faker.finance.amount(),
      product: 'MIS',
      quantity: faker.datatype.number(),
      status: 'PUT ORDER REQ RECEIVED',
      status_message: null,
      tag: null,
      tradingsymbol: faker.random.alphaNumeric(6),
      transaction_type: 'BUY',
      trigger_price: faker.finance.amount(),
      validity: 'DAY',
      variety: 'regular'
    }
  ];

  return data;
};

// Function to handle GET requests for orders by ID
export const GETOrderById = async (request: any, response: any) => {
  try {
    const { orderId } = request.params;

    const client = await pool.connect();

    // Fetch order data from the database based on the orderId
    const result = await client.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);

    client.release();

    if (result.rows.length > 0) {
      response.status(200).jsonp({
        "status": "success",
        "data": result.rows,
      });
    } else {
      response.status(404).jsonp({
        "status": "error",
        "message": "Order not found",
      });
    }
  } catch (error) {
    response.status(500).jsonp({
      "status": "error",
      "message": "Failed to fetch order",
    });
  }
};

// Function to generate random data for GETOrderByIdTrades
const generateRandomOrderByIdTradesData = (): any[] => {
  const data = [{
    trade_id: faker.datatype.number().toString(),
    order_id: faker.datatype.number().toString(),
    exchange_order_id: faker.datatype.number().toString(),
    tradingsymbol: faker.random.alphaNumeric(6),
    exchange: 'NSE',
    instrument_token: faker.datatype.number(),
    transaction_type: 'BUY',
    product: 'MIS',
    average_price: parseFloat(faker.finance.amount()),
    quantity: faker.datatype.number(),
    fill_timestamp: faker.date.past().toISOString(),
    exchange_timestamp: faker.date.past().toISOString()
  }];
  
  return data;
};

// Function to handle GET request for GETOrderByIdTrades
export const GETOrderByIdTrades = (request: any, response: any) => {
  const randomOrderByIdTradesData = generateRandomOrderByIdTradesData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomOrderByIdTradesData,
  });
};

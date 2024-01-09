const faker = require('faker');
const pool = require('../db');
// Function to generate random orders data
export const generateRandomOrders = async (count: number, client: any) => {
  // Query to select instrument_token and tradingsymbol randomly from the instruments table
  const instrumentsQuery = 'SELECT instrument_token, tradingsymbol FROM instruments ORDER BY RANDOM() LIMIT $1';
  const { rows } = await client.query(instrumentsQuery, [1]);
  const orders = [];
  for (let i = 0; i < count; i++) {
    const order = {
      id: faker.datatype.number().toString(),
      user_id: 'HQ6420',
      parent_order_id: faker.datatype.number().toString(),
      exchange_order_id: null,
      placed_by: faker.random.arrayElement(['SYSTEM', 'USER']),
      variety: 'regular',
      status: faker.random.arrayElement(['REJECTED', 'ACCEPTED', 'CANCELLED', 'COMPLETE']),
      tradingsymbol: rows[0].tradingsymbol,
      exchange: faker.random.arrayElement(['NSE', 'BSE']),
      instrument_token: rows[0].instrument_token,
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
        id: faker.datatype.number().toString(),
        user_id: 'HQ6420',
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

    ;
    console.log(`${count} orders inserted into the database.`);
  } catch (error) {
    console.error('Error inserting orders into the database:', error);
  }
};

export const GETOrders = async (request: any, response: any) => {
  try {
    const { count } = request.query;
    const ordersCount = count ? parseInt(count) : 3;

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
      ;
      return;
    }

    // Fetch specified number of random orders associated with the user using a JOIN
    const result = await client.query(
      'SELECT ' +
        'o.id as order_id, ' +
        'o.parent_order_id, ' +
        'o.exchange_order_id, ' +
        'o.placed_by, ' +
        'o.variety, ' +
        'o.status, ' +
        'o.tradingsymbol, ' +
        'o.exchange, ' +
        'o.instrument_token, ' +
        'o.transaction_type, ' +
        'o.order_type, ' +
        'o.product, ' +
        'o.validity, ' +
        'o.price, ' +
        'o.quantity, ' +
        'o.trigger_price, ' +
        'o.average_price, ' +
        'o.pending_quantity, ' +
        'o.filled_quantity, ' +
        'o.disclosed_quantity, ' +
        'o.market_protection, ' +
        'o.order_timestamp, ' +
        'o.exchange_timestamp, ' +
        'o.status_message, ' +
        'o.tag ' +
      'FROM orders o ' +
      'INNER JOIN users u ON o.user_id = u.id ' +
      'WHERE u.id = $1 ' +
      'ORDER BY RANDOM() ' +
      'LIMIT $2',
      [user.id, ordersCount]
    );

    ;

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
    const result = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);

    ;

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

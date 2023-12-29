const faker = require('faker');

// Function to generate random orders data
const generateRandomOrders = (count: number): any[] => {
  const orders = [];
  for (let i = 0; i < count; i++) {
    const order = {
      order_id: faker.random.number().toString(),
      parent_order_id: faker.random.number().toString(),
      exchange_order_id: null,
      placed_by: faker.random.alphaNumeric(6),
      variety: 'regular',
      status: faker.random.arrayElement(['REJECTED', 'PUT ORDER REQ RECEIVED', 'VALIDATION PENDING']), // Random status

      tradingsymbol: faker.random.alphaNumeric(6),
      exchange: 'NSE',
      instrument_token: faker.random.number(),
      transaction_type: 'BUY',
      order_type: 'MARKET',
      product: 'NRML',
      validity: 'DAY',

      price: parseFloat(faker.finance.amount()),
      quantity: faker.random.number(),
      trigger_price: parseFloat(faker.finance.amount()),

      average_price: parseFloat(faker.finance.amount()),
      pending_quantity: faker.random.number(),
      filled_quantity: faker.random.number(),
      disclosed_quantity: faker.random.number(),
      market_protection: faker.random.number(),

      order_timestamp: faker.date.past().toISOString(),
      exchange_timestamp: null,

      status_message: faker.lorem.sentence(),
      tag: null,
    };
    orders.push(order);
  }
  return orders;
};

// Function to handle GET requests for orders
export const GETOrders = (request: any, response: any) => {
  const randomOrders = generateRandomOrders(3); // Generating 3 random orders
  response.status(200).jsonp({
    "status": "success",
    "data": randomOrders,
  });
};

// Function to generate random data for GETOrderById
const generateRandomOrderByIdData = (): any[] => {
  const data = [
    {
      average_price: faker.finance.amount(),
      cancelled_quantity: faker.random.number(),
      disclosed_quantity: faker.random.number(),
      exchange: 'NSE',
      exchange_order_id: null,
      exchange_timestamp: null,
      filled_quantity: faker.random.number(),
      instrument_token: faker.random.number(),
      market_protection: faker.random.number(),
      order_id: faker.random.number().toString(),
      order_timestamp: faker.date.past().toISOString(),
      order_type: 'SL',
      parent_order_id: null,
      pending_quantity: faker.random.number(),
      placed_by: faker.random.alphaNumeric(6),
      price: faker.finance.amount(),
      product: 'MIS',
      quantity: faker.random.number(),
      status: 'PUT ORDER REQ RECEIVED',
      status_message: null,
      tag: null,
      tradingsymbol: faker.random.alphaNumeric(6),
      transaction_type: 'BUY',
      trigger_price: faker.finance.amount(),
      validity: 'DAY',
      variety: 'regular'
    },
    // ... Additional data objects can be added here following the same structure
  ];

  return data;
};

// Function to handle GET request for GETOrderById
export const GETOrderById = (request: any, response: any) => {
  const randomOrderByIdData = generateRandomOrderByIdData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomOrderByIdData,
  });
};

// Function to generate random data for GETOrderByIdTrades
const generateRandomOrderByIdTradesData = (): any[] => {
  const data = [{
    trade_id: faker.random.number().toString(),
    order_id: faker.random.number().toString(),
    exchange_order_id: faker.random.number().toString(),
    tradingsymbol: faker.random.alphaNumeric(6),
    exchange: 'NSE',
    instrument_token: faker.random.number(),
    transaction_type: 'BUY',
    product: 'MIS',
    average_price: parseFloat(faker.finance.amount()),
    quantity: faker.random.number(),
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

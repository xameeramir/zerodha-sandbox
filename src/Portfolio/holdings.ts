const faker = require('faker');

// Function to generate random holdings data
const generateRandomHoldingsData = (): any[] => {
  const data = [{
    tradingsymbol: faker.random.alphaNumeric(6),
    exchange: faker.random.arrayElement(['BSE', 'NSE']),
    isin: faker.random.alphaNumeric(12),
    quantity: faker.random.number(),
    t1_quantity: faker.random.number(),
    average_price: parseFloat(faker.finance.amount()),
    last_price: parseFloat(faker.finance.amount()),
    pnl: parseFloat(faker.finance.amount()),
    product: 'CNC',
    collateral_quantity: 0,
    collateral_type: null
  }, {
    tradingsymbol: faker.random.alphaNumeric(6),
    exchange: faker.random.arrayElement(['BSE', 'NSE']),
    isin: faker.random.alphaNumeric(12),
    quantity: faker.random.number(),
    t1_quantity: faker.random.number(),
    average_price: parseFloat(faker.finance.amount()),
    last_price: parseFloat(faker.finance.amount()),
    pnl: parseFloat(faker.finance.amount()),
    product: 'CNC',
    collateral_quantity: 0,
    collateral_type: null
  }];

  return data;
};

// Function to handle GET request for GETHoldings
export const GETHoldings = (request: any, response: any) => {
  const randomHoldingsData = generateRandomHoldingsData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomHoldingsData,
  });
};

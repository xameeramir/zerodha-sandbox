const faker = require('faker');

// Function to generate random trade data
const generateRandomTradeData = (): any[] => {
  const data = [{
    trade_id: faker.random.number().toString(),
    order_id: faker.random.number().toString(),
    exchange_order_id: faker.random.number().toString(),
    tradingsymbol: faker.random.alphaNumeric(6),
    exchange: 'NSE',
    instrument_token: faker.random.number().toString(),
    transaction_type: 'BUY',
    product: 'MIS',
    average_price: parseFloat(faker.finance.amount()),
    quantity: faker.random.number(),
    fill_timestamp: faker.date.past().toISOString(),
    exchange_timestamp: faker.date.past().toISOString()
  }];
  
  return data;
};

// Function to handle GET request for GETTrades
export const GETTrades = (request: any, response: any) => {
  const randomTradeData = generateRandomTradeData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomTradeData,
  });
};

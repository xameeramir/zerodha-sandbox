const faker = require('faker');

// Function to generate random positions data for GETPositions
const generateRandomPositionsData = (): any => {
  const data = {
    "net": [{
      "tradingsymbol": faker.random.alphaNumeric(16),
      "exchange": "NFO",
      "instrument_token": faker.datatype.number(),
      "product": "NRML",
      "quantity": faker.datatype.number({ min: -100, max: 100 }),
      "overnight_quantity": faker.datatype.number({ min: -100, max: 100 }),
      "multiplier": 1,
      "average_price": parseFloat(faker.finance.amount()),
      "close_price": parseFloat(faker.finance.amount()),
      "last_price": parseFloat(faker.finance.amount()),
      "value": parseFloat(faker.finance.amount()),
      "pnl": parseFloat(faker.finance.amount()),
      "m2m": parseFloat(faker.finance.amount()),
      "unrealised": parseFloat(faker.finance.amount()),
      "realised": parseFloat(faker.finance.amount()),
      "buy_quantity": faker.datatype.number(),
      "buy_price": parseFloat(faker.finance.amount()),
      "buy_value": parseFloat(faker.finance.amount()),
      "buy_m2m": parseFloat(faker.finance.amount()),
      "day_buy_quantity": faker.datatype.number(),
      "day_buy_price": parseFloat(faker.finance.amount()),
      "day_buy_value": parseFloat(faker.finance.amount()),
      "day_sell_quantity": faker.datatype.number(),
      "day_sell_price": parseFloat(faker.finance.amount()),
      "day_sell_value": parseFloat(faker.finance.amount()),
      "sell_quantity": faker.datatype.number(),
      "sell_price": parseFloat(faker.finance.amount()),
      "sell_value": parseFloat(faker.finance.amount()),
      "sell_m2m": parseFloat(faker.finance.amount())
    }],
    "day": []
  };

  return data;
};

// Function to handle GET request for GETPositions
export const GETPositions = (request: any, response: any) => {
  const randomPositionsData = generateRandomPositionsData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomPositionsData,
  });
};

// Function to handle PUT request for PUTPositions
export const PUTPositions = (request: any, response: any) => {
  response.status(200).jsonp({
    "status": "success",
    "data": true
  });
};

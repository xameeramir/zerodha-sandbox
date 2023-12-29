const faker = require('faker');

// Function to generate random quotes data for GetQuotes
const generateRandomQuotesData = (): any => {
  const data = {
    "41729": {
      "instrument_token": 41729,
      "timestamp": faker.date.past().toISOString(),
      "last_price": parseFloat(faker.finance.amount()),
      "last_quantity": faker.datatype.number(),
      "last_trade_time": faker.date.past().toISOString(),
      "average_price": parseFloat(faker.finance.amount()),
      "volume": faker.datatype.number(),
      "buy_quantity": faker.datatype.number(),
      "sell_quantity": faker.datatype.number(),
      "ohlc": {
        "open": parseFloat(faker.finance.amount()),
        "high": parseFloat(faker.finance.amount()),
        "low": parseFloat(faker.finance.amount()),
        "close": parseFloat(faker.finance.amount())
      },
      "net_change": faker.datatype.number(),
      "oi": faker.datatype.number(),
      "oi_day_high": faker.datatype.number(),
      "oi_day_low": faker.datatype.number(),
      "depth": {
        "buy": Array.from({ length: 5 }, () => ({
          "price": parseFloat(faker.finance.amount()),
          "quantity": faker.datatype.number(),
          "orders": faker.datatype.number()
        })),
        "sell": Array.from({ length: 5 }, () => ({
          "price": parseFloat(faker.finance.amount()),
          "quantity": faker.datatype.number(),
          "orders": faker.datatype.number()
        }))
      }
    },
    "NSE:INFY": {
      "instrument_token": 408065,
      "timestamp": faker.date.past().toISOString(),
      "last_price": parseFloat(faker.finance.amount()),
      "last_quantity": faker.datatype.number(),
      "last_trade_time": faker.date.past().toISOString(),
      "average_price": parseFloat(faker.finance.amount()),
      "volume": faker.datatype.number(),
      "buy_quantity": faker.datatype.number(),
      "sell_quantity": faker.datatype.number(),
      "ohlc": {
        "open": parseFloat(faker.finance.amount()),
        "high": parseFloat(faker.finance.amount()),
        "low": parseFloat(faker.finance.amount()),
        "close": parseFloat(faker.finance.amount())
      }
    }
  };
  return data;
};

// Function to generate random OHLC data for GetQuotesOHLC
const generateRandomOHLCData = (): any => {
  const data = {
    "BSE:SENSEX": {
      "instrument_token": 265,
      "last_price": parseFloat(faker.finance.amount()),
      "ohlc": {
        "open": parseFloat(faker.finance.amount()),
        "high": parseFloat(faker.finance.amount()),
        "low": parseFloat(faker.finance.amount()),
        "close": parseFloat(faker.finance.amount())
      }
    },
    "NSE:INFY": {
      "instrument_token": 408065,
      "last_price": parseFloat(faker.finance.amount()),
      "ohlc": {
        "open": parseFloat(faker.finance.amount()),
        "high": parseFloat(faker.finance.amount()),
        "low": parseFloat(faker.finance.amount()),
        "close": parseFloat(faker.finance.amount())
      }
    },
    "NSE:NIFTY 50": {
      "instrument_token": 256265,
      "last_price": parseFloat(faker.finance.amount()),
      "ohlc": {
        "open": parseFloat(faker.finance.amount()),
        "high": parseFloat(faker.finance.amount()),
        "low": parseFloat(faker.finance.amount()),
        "close": parseFloat(faker.finance.amount())
      }
    }
  };
  return data;
};

// Function to generate random last price data for GetQuotesLTP
const generateRandomLTPData = (): any => {
  const data = {
    "BSE:SENSEX": {
      "instrument_token": 265,
      "last_price": parseFloat(faker.finance.amount())
    },
    "NSE:INFY": {
      "instrument_token": 408065,
      "last_price": parseFloat(faker.finance.amount())
    },
    "NSE:NIFTY 50": {
      "instrument_token": 256265,
      "last_price": parseFloat(faker.finance.amount())
    }
  };
  return data;
};

// Function to handle GET request for GetQuotes
export const GetQuotes = (request: any, response: any) => {
  const randomQuotesData = generateRandomQuotesData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomQuotesData,
  });
};

// Function to handle GET request for GetQuotesOHLC
export const GetQuotesOHLC = (request: any, response: any) => {
  const randomOHLCData = generateRandomOHLCData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomOHLCData,
  });
};

// Function to handle GET request for GetQuotesLTP
export const GetQuotesLTP = (request: any, response: any) => {
  const randomLTPData = generateRandomLTPData();
  response.status(200).jsonp({
    "status": "success",
    "data": randomLTPData,
  });
};

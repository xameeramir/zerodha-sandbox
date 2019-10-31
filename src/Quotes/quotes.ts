export const GetQuotes = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the request query string handling logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
          "41729": {
            "instrument_token": 41729,
            "timestamp": "2018-01-12 10:31:54",
            "last_price": 278.75,
            "last_quantity": 8,
            "last_trade_time": "2018-01-12 10:31:54",
            "average_price": 279.04,
            "volume": 559981,
            "buy_quantity": 703982,
            "sell_quantity": 424423,
            "ohlc": {
              "open": 279.45,
              "high": 280.55,
              "low": 277.4,
              "close": 279.05
            },
            "net_change": 0,
            "oi": 0,
            "oi_day_high": 0,
            "oi_day_low": 0,
            "depth": {
              "buy": [
                {
                  "price": 278.7,
                  "quantity": 750,
                  "orders": 1
                },
                {
                  "price": 278.6,
                  "quantity": 340,
                  "orders": 3
                },
                {
                  "price": 278.55,
                  "quantity": 1880,
                  "orders": 5
                },
                {
                  "price": 278.5,
                  "quantity": 2259,
                  "orders": 10
                },
                {
                  "price": 278.45,
                  "quantity": 1456,
                  "orders": 4
                }
              ],
              "sell": [
                {
                  "price": 278.75,
                  "quantity": 117,
                  "orders": 5
                },
                {
                  "price": 278.8,
                  "quantity": 382,
                  "orders": 2
                },
                {
                  "price": 278.85,
                  "quantity": 5,
                  "orders": 1
                },
                {
                  "price": 278.9,
                  "quantity": 518,
                  "orders": 2
                },
                {
                  "price": 278.95,
                  "quantity": 2663,
                  "orders": 7
                }
              ]
            }
          },
          "NSE:INFY": {
            "instrument_token": 408065,
            "timestamp": "2018-01-12 10:31:54",
            "last_price": 1075.1,
            "last_quantity": 14,
            "last_trade_time": "2018-01-12 10:31:53",
            "average_price": 1077.13,
            "volume": 1311662,
            "buy_quantity": 235801,
            "sell_quantity": 496803,
          }
        }
      });
}

export const GetQuotesOHLC = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the request query string handling logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "BSE:SENSEX": {
                "instrument_token": 265,
                "last_price": 31606.48,
                "ohlc": {
                    "open": 31713.5,
                    "high": 31713.5,
                    "low": 31586.53,
                    "close": 31809.55
                }
            },
            "NSE:INFY": {
                "instrument_token": 408065,
                "last_price": 890.9,
                "ohlc": {
                    "open": 900,
                    "high": 900.3,
                    "low": 890,
                    "close": 901.9
                }
            },
            "NSE:NIFTY 50": {
                "instrument_token": 256265,
                "last_price": 9893.4,
                "ohlc": {
                    "open": 9899.25,
                    "high": 9911.9,
                    "low": 9882.55,
                    "close": 9952.2
                }
            }
        }
    });
}

export const GetQuotesLTP = (request: any, response: any) => {
    
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the request query string handling logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "BSE:SENSEX": {
                "instrument_token": 265,
                "last_price": 31606.48
            },
            "NSE:INFY": {
                "instrument_token": 408065,
                "last_price": 890.9
            },
            "NSE:NIFTY 50": {
                "instrument_token": 256265,
                "last_price": 9893.4
            }
        }
    });
}

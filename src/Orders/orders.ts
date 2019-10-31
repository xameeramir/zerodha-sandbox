export const GETOrders = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the request body handling logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": [{
            "order_id": "151220000000000",
            "parent_order_id": "151210000000000",
            "exchange_order_id": null,
            "placed_by": "AB0012",
            "variety": "regular",
            "status": "REJECTED",

            "tradingsymbol": "ACC",
            "exchange": "NSE",
            "instrument_token": 22,
            "transaction_type": "BUY",
            "order_type": "MARKET",
            "product": "NRML",
            "validity": "DAY",

            "price": 0.0,
            "quantity": 75,
            "trigger_price": 0.0,

            "average_price": 0.0,
            "pending_quantity": 0,
            "filled_quantity": 0,
            "disclosed_quantity": 0,
            "market_protection": 0,

            "order_timestamp": "2015-12-20 15:01:43",
            "exchange_timestamp": null,

            "status_message": "RMS:Margin Exceeds, Required:0, Available:0",
            "tag": null
        }]
    });
}

export const GETOrderById = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the request body handling logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": [
            {
                "average_price": 0,
                "cancelled_quantity": 0,
                "disclosed_quantity": 0,
                "exchange": "NSE",
                "exchange_order_id": null,
                "exchange_timestamp": null,
                "filled_quantity": 0,
                "instrument_token": 1,
                "market_protection": 0,
                "order_id": "171222000539943",
                "order_timestamp": "2017-12-22 10:36:09",
                "order_type": "SL",
                "parent_order_id": null,
                "pending_quantity": 1,
                "placed_by": "ZQXXXX",
                "price": 130,
                "product": "MIS",
                "quantity": 1,
                "status": "PUT ORDER REQ RECEIVED",
                "status_message": null,
                "tag": null,
                "tradingsymbol": "ASHOKLEY",
                "transaction_type": "BUY",
                "trigger_price": 128,
                "validity": "DAY",
                "variety": "regular"
            },
            {
                "average_price": 0,
                "cancelled_quantity": 0,
                "disclosed_quantity": 0,
                "exchange": "NSE",
                "exchange_order_id": null,
                "exchange_timestamp": null,
                "filled_quantity": 0,
                "instrument_token": 54273,
                "market_protection": 0,
                "order_id": "171222000539943",
                "order_timestamp": "2017-12-22 10:36:09",
                "order_type": "SL",
                "parent_order_id": null,
                "pending_quantity": 1,
                "placed_by": "ZQXXXX",
                "price": 130,
                "product": "MIS",
                "quantity": 1,
                "status": "VALIDATION PENDING",
                "status_message": null,
                "tag": null,
                "tradingsymbol": "ASHOKLEY",
                "transaction_type": "BUY",
                "trigger_price": 128,
                "validity": "DAY",
                "variety": "regular"
            },
            {
                "average_price": 0,
                "cancelled_quantity": 0,
                "disclosed_quantity": 0,
                "exchange": "NSE",
                "exchange_order_id": null,
                "exchange_timestamp": null,
                "filled_quantity": 0,
                "instrument_token": 54273,
                "market_protection": 0,
                "order_id": "171222000539943",
                "order_timestamp": "2017-12-22 10:36:09",
                "order_type": "SL",
                "parent_order_id": null,
                "pending_quantity": 0,
                "placed_by": "ZQXXXX",
                "price": 130,
                "product": "MIS",
                "quantity": 1,
                "status": "REJECTED",
                "status_message": "RMS:Rule: Check circuit limit including square off order exceeds  for entity account-DH0490 across exchange across segment across product ",
                "tag": null,
                "tradingsymbol": "ASHOKLEY",
                "transaction_type": "BUY",
                "trigger_price": 128,
                "validity": "DAY",
                "variety": "regular"
            }
        ]
    });
}

export const GETOrderByIdTrades = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the request body handling logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": [{
            "trade_id": "159918",
            "order_id": "151220000000000",
            "exchange_order_id": "511220371736111",

            "tradingsymbol": "ACC",
            "exchange": "NSE",
            "instrument_token": "22",

            "transaction_type": "BUY",
            "product": "MIS",
            "average_price": 100.98,
            "quantity": 10,

            "fill_timestamp": "2015-12-20 15:01:44",
            "exchange_timestamp": "2015-12-20 15:01:43"

        }]
    });
}
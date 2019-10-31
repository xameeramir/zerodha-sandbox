export const POSTGTTtrigger = (request: any, response: any) => {
    
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and request body validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status":"success",
        "data":{
            "trigger_id":1337
        }
    });
}

export const GETGTTtrigger = (request: any, response: any) => {
    
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": [
            {
                "id": 112127,
                "user_id": "XX0000",
                "parent_trigger": null,
                "type": "single",
                "created_at": "2019-09-12 13:25:16",
                "updated_at": "2019-09-12 13:25:16",
                "expires_at": "2020-09-12 13:25:16",
                "status": "active",
                "condition": {
                    "exchange": "NSE",
                    "last_price": 798,
                    "tradingsymbol": "INFY",
                    "trigger_values": [
                        702
                    ],
                    "instrument_token": 408065
                },
                "orders": [
                    {
                        "account_id": "",
                        "parent_order_id": "",
                        "exchange": "NSE",
                        "tradingsymbol": "INFY",
                        "validity": "",
                        "product": "CNC",
                        "order_type": "LIMIT",
                        "transaction_type": "BUY",
                        "quantity": 1,
                        "disclosed_quantity": 0,
                        "price": 702.5,
                        "trigger_price": 0,
                        "ltp_atp": "",
                        "squareoff_abs_tick": "",
                        "stoploss_abs_tick": "",
                        "squareoff": 0,
                        "stoploss": 0,
                        "trailing_stoploss": 0,
                        "meta": "",
                        "guid": "",
                        "result": null
                    }
                ],
                "meta": {}
            },
            {
                "id": 105099,
                "user_id": "XX0000",
                "parent_trigger": null,
                "type": "two-leg",
                "created_at": "2019-09-09 15:13:22",
                "updated_at": "2019-09-09 15:15:08",
                "expires_at": "2020-01-01 12:00:00",
                "status": "triggered",
                "condition": {
                    "exchange": "NSE",
                    "last_price": 102.6,
                    "tradingsymbol": "RAIN",
                    "trigger_values": [
                        102.0,
                        103.7
                    ],
                    "instrument_token": 3926273
                },
                "orders": [
                    {
                        "account_id": "",
                        "parent_order_id": "",
                        "exchange": "NSE",
                        "tradingsymbol": "RAIN",
                        "validity": "",
                        "product": "CNC",
                        "order_type": "LIMIT",
                        "transaction_type": "SELL",
                        "quantity": 1,
                        "disclosed_quantity": 0,
                        "price": 1,
                        "trigger_price": 0,
                        "ltp_atp": "",
                        "squareoff_abs_tick": "",
                        "stoploss_abs_tick": "",
                        "squareoff": 0,
                        "stoploss": 0,
                        "trailing_stoploss": 0,
                        "meta": "",
                        "guid": "",
                        "result": null
                    },
                    {
                        "account_id": "",
                        "parent_order_id": "",
                        "exchange": "NSE",
                        "tradingsymbol": "RAIN",
                        "validity": "",
                        "product": "CNC",
                        "order_type": "LIMIT",
                        "transaction_type": "SELL",
                        "quantity": 1,
                        "disclosed_quantity": 0,
                        "price": 1,
                        "trigger_price": 0,
                        "ltp_atp": "",
                        "squareoff_abs_tick": "",
                        "stoploss_abs_tick": "",
                        "squareoff": 0,
                        "stoploss": 0,
                        "trailing_stoploss": 0,
                        "meta": "",
                        "guid": "",
                        "result": {
                            "account_id": "XX0000",
                            "parent_order_id": "",
                            "exchange": "NSE",
                            "tradingsymbol": "RAIN",
                            "validity": "DAY",
                            "product": "CNC",
                            "order_type": "LIMIT",
                            "transaction_type": "SELL",
                            "quantity": 1,
                            "disclosed_quantity": 0,
                            "price": 1,
                            "trigger_price": 0,
                            "ltp_atp": "LTP",
                            "squareoff_abs_tick": "absolute",
                            "stoploss_abs_tick": "absolute",
                            "squareoff": 0,
                            "stoploss": 0,
                            "trailing_stoploss": 0,
                            "meta": "{\"app_id\":12617,\"gtt\":105099}",
                            "guid": "",
                            "timestamp": "2019-09-09 15:15:08",
                            "triggered_at": 103.7,
                            "order_result": {
                                "status": "failed",
                                "order_id": "",
                                "rejection_reason": "Your order price is lower than the current lower circuit limit of 70.65. Place an order within the daily range."
                            }
                        }
                    }
                ],
                "meta": null
            }
        ]
    });
}

export const GETGTTtriggerById = (request: any, response: any) => {
    
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query params validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "id": 105099,
            "user_id": "XX0000",
            "parent_trigger": null,
            "type": "two-leg",
            "created_at": "2019-09-09 15:13:22",
            "updated_at": "2019-09-09 15:15:08",
            "expires_at": "2020-01-01 12:00:00",
            "status": "triggered",
            "condition": {
                "exchange": "NSE",
                "last_price": 102.6,
                "tradingsymbol": "RAIN",
                "trigger_values": [
                    102.0,
                    103.7
                ],
                "instrument_token": 3926273
            },
            "orders": [
                {
                    "account_id": "",
                    "parent_order_id": "",
                    "exchange": "NSE",
                    "tradingsymbol": "RAIN",
                    "validity": "",
                    "product": "CNC",
                    "order_type": "LIMIT",
                    "transaction_type": "SELL",
                    "quantity": 1,
                    "disclosed_quantity": 0,
                    "price": 1,
                    "trigger_price": 0,
                    "ltp_atp": "",
                    "squareoff_abs_tick": "",
                    "stoploss_abs_tick": "",
                    "squareoff": 0,
                    "stoploss": 0,
                    "trailing_stoploss": 0,
                    "meta": "",
                    "guid": "",
                    "result": null
                },
                {
                    "account_id": "",
                    "parent_order_id": "",
                    "exchange": "NSE",
                    "tradingsymbol": "RAIN",
                    "validity": "",
                    "product": "CNC",
                    "order_type": "LIMIT",
                    "transaction_type": "SELL",
                    "quantity": 1,
                    "disclosed_quantity": 0,
                    "price": 1,
                    "trigger_price": 0,
                    "ltp_atp": "",
                    "squareoff_abs_tick": "",
                    "stoploss_abs_tick": "",
                    "squareoff": 0,
                    "stoploss": 0,
                    "trailing_stoploss": 0,
                    "meta": "",
                    "guid": "",
                    "result": {
                        "account_id": "XX0000",
                        "parent_order_id": "",
                        "exchange": "NSE",
                        "tradingsymbol": "RAIN",
                        "validity": "DAY",
                        "product": "CNC",
                        "order_type": "LIMIT",
                        "transaction_type": "SELL",
                        "quantity": 1,
                        "disclosed_quantity": 0,
                        "price": 1,
                        "trigger_price": 0,
                        "ltp_atp": "LTP",
                        "squareoff_abs_tick": "absolute",
                        "stoploss_abs_tick": "absolute",
                        "squareoff": 0,
                        "stoploss": 0,
                        "trailing_stoploss": 0,
                        "meta": "{\"app_id\":12617,\"gtt\":105099}",
                        "guid": "",
                        "timestamp": "2019-09-09 15:15:08",
                        "triggered_at": 103.7,
                        "order_result": {
                            "status": "failed",
                            "order_id": "",
                            "rejection_reason": "Your order price is lower than the current lower circuit limit of 70.65. Place an order within the daily range."
                        }
                    }
                }
            ],
            "meta": null
        }
    });
}

export const PUTGTTtriggerById = (request: any, response: any) => {
    
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and request body validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status":"success",
        "data":{
            "trigger_id":1337
        }
    });
}

export const DELETEGTTtriggerById = (request: any, response: any) => {
    
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status":"success",
        "data":{
            "trigger_id":1337
        }
    });
}
export const POSTMFOrders = (request: any, response: any) => {

    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "order_id": "123456"
        }
    });
}

export const DELETEMFOrderById = (request: any, response: any) => {

    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "order_id": "123456"
        }
    });
}

export const GETMFOrders = (request: any, response: any) => {

    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": [{
            "order_id": "123123",
            "exchange_order_id": "12341234",
            "tradingsymbol": "INF090I01239",
            "status": "COMPLETE",
            "status_message": "",
            "folio": "1234ABC/123",
            "fund": "Franklin India Prima Plus",
            "order_timestamp": "2016-07-05 13:38",
            "exchange_timestamp": "2016-07-06",
            "settlement_id": "1617100",
            "transaction_type": "BUY",
            "variety": "regular",
            "purchase_type": "FRESH",
            "quantity": 10,
            "price": 0,
            "last_price": 580,
            "last_price_date": "2016-07-10",
            "average_price": 500.4463,
            "placed_by": "AB0012",
            "tag": ""
        }]
    })
}

export const GETMFOrdersById = (request: any, response: any) => {

    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "order_id": "123123",
            "exchange_order_id": "12341234",
            "tradingsymbol": "INF090I01239",
            "status": "COMPLETE",
            "status_message": "",
            "folio": "1234ABC/123",
            "fund": "Franklin India Prima Plus",
            "order_timestamp": "2016-07-05 13:38",
            "exchange_timestamp": "2016-07-06",
            "settlement_id": "1617100",
            "transaction_type": "BUY",
            "variety": "regular",
            "purchase_type": "FRESH",
            "quantity": 10,
            "price": 0,
            "last_price": 580,
            "average_price": 500.4463,
            "placed_by": "AB0012",
            "tag": ""
        }
    });
}
export const POSTMFSips = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "order_id": "123457",
            "sip_id": "123457"
        }
    });
}

export const PUTMFSipsByOrderId = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {}
    });
}

export const DELETEMFSipsByOrderId = (request: any, response: any) => {
    response.status(200).jsonp({
        "message": "Zerodha have not given the sample response of this API"
    });
}

export const GETMFSips = (request: any, response: any) => {

    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": [{
            "sip_id": "1234",
            "tradingsymbol": "INF090I01239",
            "fund": "Franklin India Prima Plus",
            "dividend_type": "growth",
            "transaction_type": "BUY",
            "status": "ACTIVE",
            "created": "2016-01-01 13:00:00",
            "frequency": "monthly",
            "instalment_amount": 1000,
            "instalments": -1,
            "last_instalment": "2017-07-05 07:33:32",
            "pending_instalments": -1,
            "instalment_date": 5,
            "tag": ""
        }]
    });
}

export const GETMFSipsByOrderId = (request: any, response: any) => {
    response.status(200).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the random data generation logic and query string validation logic https://github.com/nordible/zerodha-sandbox/pulls",
        "status": "success",
        "data": {
            "sip_id": "1234",
            "tradingsymbol": "INF090I01239",
            "fund": "Franklin India Prima Plus",
            "dividend_type": "growth",
            "transaction_type": "BUY",
            "status": "ACTIVE",
            "created": "2016-01-01 13:00:00",
            "frequency": "monthly",
            "instalment_amount": 1000,
            "instalments": -1,
            "last_instalment": "2017-07-05 07:33:32",
            "pending_instalments": -1,
            "instalment_date": 5,
            "tag": ""
        }
    });
}
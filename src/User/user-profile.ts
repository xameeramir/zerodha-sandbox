export const GETUserProfile = (request: any, response: any) => {

    response.status(200).jsonp({
        "status": "success",
        "data": {
            "user_type": "investor",
            "email": "info@nordible.com",
            "user_name": "Nordible Software",
            "user_shortname": "Nordible",
            "broker": "ZERODHA",
            "exchanges": [
                "MCX",
                "BSE",
                "NSE",
                "BFO",
                "NFO",
                "CDS"
            ],
            "products": [
                "BO",
                "CNC",
                "CO",
                "MIS",
                "NRML"
            ],
            "order_types": [
                "LIMIT",
                "MARKET",
                "SL",
                "SL-M"
            ]
        }
    });
}
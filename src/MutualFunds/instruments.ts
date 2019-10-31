export const GETMFInstruments = (request: any, response: any) => {
    response.status(200).jsonp({
        "message": "No mock needed! This API can be directly called from https://api.kite.trade/mf/instruments"
    });
}

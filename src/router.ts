import { POSTSessionToken, DELETESessionToken } from "./User/session-token";
import { GETUserProfile } from "./User/user-profile";
import { GETUserMarginSegments } from "./User/user-margins-segment";
import { POSTOrderVariety, PUTOrderVariety, DELETEOrderVariety } from './Orders/orders-variety';
import { GETOrders, GETOrderById, GETOrderByIdTrades } from './Orders/orders';
import { GETTrades } from './Orders/trades';
import { GETHoldings } from './Portfolio/holdings';
import { GETPositions } from './Portfolio/positions';
import { PUTPositions } from './Portfolio/positions';
import { GetInstruments, GetInstrumentsByExchange } from './Instruments/instruments';
import { GetQuotes, GetQuotesOHLC, GetQuotesLTP } from './Quotes/quotes';

const UnderContruction = (request: any, response: any) => {
    response.status(503).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the API response https://github.com/nordible/zerodha-sandbox/pulls"
    });
}

export const router = (server: any) => {

    // User routes
    server.post('/session/token', POSTSessionToken);
    server.post('/user/profile', GETUserProfile);
    server.post('user/margins/:segment', GETUserMarginSegments);
    server.delete('/session/token', DELETESessionToken);

    // Orders routes
    server.post('/orders/:variety', POSTOrderVariety);
    server.put('/orders/:variety/:order_id', PUTOrderVariety);
    server.delete('/orders/:variety/:order_id', DELETEOrderVariety);
    server.get('/orders', GETOrders);
    server.get('/orders/:order_id', GETOrderById);
    server.get('/trades', GETTrades);
    server.get('/orders/:order_id/trades', GETOrderByIdTrades);

    // Portfolio
    server.get('/portfolio/holdings', GETHoldings);
    server.get('/portfolio/positions', GETPositions);
    server.put('/portfolio/positions', PUTPositions);

    // Market quotes and instruments
    server.get('/instruments', GetInstruments);
    server.get('/instruments/:exchange', GetInstrumentsByExchange);
    server.get('/quote', GetQuotes);
    server.get('/quote/ohlc', GetQuotesOHLC);
    server.get('/quote/ltp', GetQuotesLTP);

    // Historical candle data
    server.get('/instruments/historical/:instrument_token/:interval', UnderContruction);

    // Mutual funds
    server.post('/mf/orders', UnderContruction);
    server.delete('/mf/orders/:order_id', UnderContruction);
    server.get('/mf/orders', UnderContruction);
    server.get('/mf/orders/:order_id', UnderContruction);
    server.post('/mf/sips', UnderContruction);
    server.put('/mf/sips/:order_id', UnderContruction);
    server.delete('/mf/sips/:order_id', UnderContruction);
    server.get('/mf/sips/', UnderContruction);
    server.get('/mf/sips/:order_id', UnderContruction);
    server.get('/mf/holdings', UnderContruction);
    server.get('/mf/instruments', UnderContruction);

    // GTT - Good Till Triggered orders
    server.post('/gtt/triggers', UnderContruction);
    server.get('/gtt/triggers', UnderContruction);
    server.get('/gtt/triggers/:id', UnderContruction);
    server.put('/gtt/triggers/:id', UnderContruction);
    server.delete('/gtt/triggers/:id', UnderContruction);


}
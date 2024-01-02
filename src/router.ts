import { POSTSessionToken, DELETESessionToken } from "./User/session-token";
import { GETUserProfile } from "./User/user-profile";
import { GETUserMarginSegments } from "./User/user-margins-segment";
import { POSTOrderVariety, PUTOrderVariety, DELETEOrderVariety } from './Orders/orders-variety';
import { GETOrders, GETOrderById, GETOrderByIdTrades, generateAndInsertRandomOrders } from './Orders/orders';
import { GETTrades } from './Orders/trades';
import { GETHoldings } from './Portfolio/holdings';
import { GETPositions } from './Portfolio/positions';
import { PUTPositions } from './Portfolio/positions';
import { GetInstruments, GetInstrumentsByExchange } from './Instruments/instruments';
import { GetQuotes, GetQuotesOHLC, GetQuotesLTP } from './Quotes/quotes';
import { GETCandleData } from './HistoricalData/candle-data';
import { POSTMFOrders, DELETEMFOrderById, GETMFOrders, GETMFOrdersById} from './MutualFunds/orders';
import { POSTMFSips, PUTMFSipsByOrderId, DELETEMFSipsByOrderId, GETMFSips, GETMFSipsByOrderId } from "./MutualFunds/sips";
import { GETMFHoldings } from "./MutualFunds/holdings";
import { GETMFInstruments } from "./MutualFunds/instruments";
import { DELETEGTTtriggerById, PUTGTTtriggerById, GETGTTtriggerById, GETGTTtrigger, POSTGTTtrigger } from "./GTT/triggers";

const UnderContruction = (request: any, response: any) => {
    response.status(503).jsonp({
        "COLLABORATION-NEEDED": "Please contibute the API response https://github.com/nordible/zerodha-sandbox/pulls"
    });
}

const WebSocket = require('ws');

function startWebSocketServer(instruments: any) {
  const wss = new WebSocket.Server({ port: 8082 });
  
  interface InstrumentPrice {
    price: number;
    interval: NodeJS.Timeout;
  }
  
  interface InstrumentPrices {
    [key: string]: InstrumentPrice;
  }
  
  const instrumentPrices: InstrumentPrices = {};

  wss.on('connection', (ws: any) => {
    ws.on('message', (message: any) => {
      console.log('Received message:', message);
      // Process the message and potentially send responses
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
    

    instruments.forEach((instrument: any) => {
      const { instrument_token, min_price, max_price } = instrument;

      if (!instrumentPrices[instrument_token]) {
        let increasing = true; // Flag to indicate increasing or decreasing price
        instrumentPrices[instrument_token] = {
          price: min_price, // Initial price
          interval: setInterval(() => {
            const currentPrice = instrumentPrices[instrument_token].price;

            if (increasing) {
              if (currentPrice < max_price) {
                instrumentPrices[instrument_token].price += 0.1; // Increment price by 0.1
              } else {
                increasing = false; // Change direction to decrease
              }
            } else {
              if (currentPrice > min_price) {
                instrumentPrices[instrument_token].price -= 0.1; // Decrement price by 0.1
              } else {
                increasing = true; // Change direction to increase
              }
            }

            const response = {
              instrument_token: instrument_token,
              last_price: instrumentPrices[instrument_token].price,
              timestamp: Date.now(),
            };
            ws.send(JSON.stringify(response));
          }, 10 * 60 * 1000), // 10 minutes interval
        };
      }
    });
  });
}

export const router = (server: any) => {

    // User routes
    server.post('/session/token', POSTSessionToken);
    server.post('/user/profile', GETUserProfile);
    server.get('/user/margins', GETUserMarginSegments);
    server.get('/user/margins/:segment', GETUserMarginSegments);
    server.delete('/session/token', DELETESessionToken);

    // Orders routes
    server.post('/orders/:variety', POSTOrderVariety);
    server.put('/orders/:variety/:order_id', PUTOrderVariety);
    server.delete('/orders/:variety/:order_id', DELETEOrderVariety);
    server.get('/orders', GETOrders);
    server.get('/generate-orders', generateAndInsertRandomOrders);
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
    server.get('/instruments/historical/:instrument_token/:interval', GETCandleData);

    // Mutual funds
    server.post('/mf/orders', POSTMFOrders);
    server.delete('/mf/orders/:order_id', DELETEMFOrderById);
    server.get('/mf/orders', GETMFOrders);
    server.get('/mf/orders/:order_id', GETMFOrdersById);
    server.post('/mf/sips', POSTMFSips);
    server.put('/mf/sips/:order_id', PUTMFSipsByOrderId);
    server.delete('/mf/sips/:order_id', DELETEMFSipsByOrderId);
    server.get('/mf/sips/', GETMFSips);
    server.get('/mf/sips/:order_id', GETMFSipsByOrderId);
    server.get('/mf/holdings', GETMFHoldings);
    server.get('/mf/instruments', GETMFInstruments);

    // GTT - Good Till Triggered orders
    server.post('/gtt/triggers', POSTGTTtrigger);
    server.get('/gtt/triggers', GETGTTtrigger);
    server.get('/gtt/triggers/:id', GETGTTtriggerById);
    server.put('/gtt/triggers/:id', PUTGTTtriggerById);
    server.delete('/gtt/triggers/:id', DELETEGTTtriggerById);
    server.post('/start-websocket', (req: any, res: any) => {
        if (!req.body || !Array.isArray(req.body)) {
          return res.status(400).send('Invalid instruments data');
        }
        startWebSocketServer(req.body);
        res.send('WebSocket server started successfully');
      });

}
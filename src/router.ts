import { POSTSessionToken, DELETESessionToken } from "./User/session-token";
import { GETUserProfile } from "./User/user-profile";
import { GETUserMarginSegments } from "./User/user-margins-segment";
import {
  POSTOrderVariety,
  PUTOrderVariety,
  DELETEOrderVariety,
} from "./Orders/orders-variety";
import {
  GETOrders,
  GETOrderById,
  GETOrderByIdTrades,
  generateAndInsertRandomOrders,
} from "./Orders/orders";
import { GETTrades } from "./Orders/trades";
import { GETHoldings, calculateAndInsertHoldings } from "./Portfolio/holdings";
import { GETPositions } from "./Portfolio/positions";
import { PUTPositions } from "./Portfolio/positions";
import {
  GetInstruments,
  GetInstrumentsByExchange,
} from "./Instruments/instruments";
import { GetQuotes, GetQuotesOHLC, GetQuotesLTP } from "./Quotes/quotes";
import { GETCandleData } from "./HistoricalData/candle-data";
import {
  POSTMFOrders,
  DELETEMFOrderById,
  GETMFOrders,
  GETMFOrdersById,
} from "./MutualFunds/orders";
import {
  POSTMFSips,
  PUTMFSipsByOrderId,
  DELETEMFSipsByOrderId,
  GETMFSips,
  GETMFSipsByOrderId,
} from "./MutualFunds/sips";
import { GETMFHoldings } from "./MutualFunds/holdings";
import { GETMFInstruments } from "./MutualFunds/instruments";
import {
  DELETEGTTtriggerById,
  PUTGTTtriggerById,
  GETGTTtriggerById,
  GETGTTtrigger,
  POSTGTTtrigger,
} from "./GTT/triggers";
const pool = require("./db");

const UnderContruction = (request: any, response: any) => {
  response.status(503).jsonp({
    "COLLABORATION-NEEDED":
      "Please contibute the API response https://github.com/nordible/zerodha-sandbox/pulls",
  });
};

const WebSocket = require("ws");
var wss: any;
interface InstrumentPrice {
  price: number;
  interval: NodeJS.Timeout;
}

interface InstrumentPrices {
  [key: string]: InstrumentPrice;
}
const instrumentPrices: InstrumentPrices = {};
let isServerRunning = false; // Flag to track server status
function sendPriceUpdates(ws: any) {
  Object.keys(instrumentPrices).forEach((instrumentToken) => {
    const currentPrice = instrumentPrices[instrumentToken].price;

    const response = [{
      instrument_token: Number(instrumentToken),
      last_price: currentPrice,
      mode: "ltp",
      tradable: true
    }];

    // Check if the WebSocket connection is open before sending
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(response));
    }
  });
}
async function getDistinctInstrumentTokensForUser(client: any) {
  let tokens = [];
  const userQuery = await client.query(
    `SELECT DISTINCT orders.instrument_token 
    FROM orders 
    INNER JOIN portfolio_positions ON orders.id = portfolio_positions.order_id`
  );
  // Extract distinct instrument tokens from the userQuery result
  tokens = userQuery.rows.map((row: any) => row.instrument_token);

  if (tokens.length === 0) {
    const userQueryHoldings = await client.query(
      `SELECT DISTINCT orders.instrument_token 
      FROM orders 
      INNER JOIN portfolio_holdings ON orders.instrument_token = portfolio_holdings.instrument_token`
    );

    tokens = userQueryHoldings.rows.map((row: any) => row.instrument_token);
  }

  return tokens;
}

export async function startWebSocketServer() {
  let retryInterval: any;
  const MAX_LISTENERS = 300;
  const client = await pool.connect();
  wss = new WebSocket.Server({ port: 8082 });
  wss.setMaxListeners(MAX_LISTENERS);
  const checkDistinctTokens = async () => {
    const distinctTokens = await getDistinctInstrumentTokensForUser(client);
    if (!distinctTokens || distinctTokens.length === 0) {
      // Retry after 2 second if distinct tokens are not found or length is 0
      retryInterval = setTimeout(checkDistinctTokens, 2000);
    } else {
      // Once distinct tokens are available, clear the retry interval
      clearTimeout(retryInterval);
      wss.on("connection", (ws: any) => {
        ws.on("message", (message: any) => {
          console.log("Received message:", message);
        });

        ws.on("close", () => {
          console.log("Client disconnected");
          ws.removeAllListeners();
        });

        // Send current instrument prices to the newly connected client
        sendPriceUpdates(ws);
      });

      wss.on("listening", () => {
        isServerRunning = true;
      });

      wss.on("close", () => {
        isServerRunning = false;
      });

      // Process distinct tokens
      distinctTokens.forEach((instrument: any) => {
        const instrument_token = instrument;
        if (!instrumentPrices[instrument_token]) {
          let increasing = true;
          let min_price = 10;
          let max_price = 15;
          instrumentPrices[instrument_token] = {
            price: min_price, // Initial price
            interval: setInterval(() => {
              if (increasing) {
                if (instrumentPrices[instrument_token].price < max_price) {
                  instrumentPrices[instrument_token].price += 0.1; // Increment price by 0.1
                } else {
                  increasing = false; // Change direction to decrease
                }
              } else {
                if (instrumentPrices[instrument_token].price > min_price) {
                  instrumentPrices[instrument_token].price -= 0.1; // Decrement price by 0.1
                } else {
                  increasing = true; // Change direction to increase
                }
              }

              // Send price updates to all connected clients
              wss.clients.forEach((client: any) => {
                if (client.readyState === client.OPEN) {
                  sendPriceUpdates(client);
                }
              });
            }, 1000), // 1 second interval
          };
        }
      });
    }
  };

  const interval = setInterval(async () => {
    await checkDistinctTokens();
  }, 10000); //  10 seconds check
}
// Function to clear all intervals related to instruments
export function clearIntervalAllInstruments() {
  Object.keys(instrumentPrices).forEach(function (instrument_token) {
    clearInterval(instrumentPrices[instrument_token].interval);
    delete instrumentPrices[instrument_token];
  });
}
function isWebSocketActive(wss: any) {
  return wss && wss.readyState === wss.OPEN;
}

export async function restartWebSocketServer() {
  if (isServerRunning) {
    if (wss) {
      wss.close((err: any) => {
        if (err) {
          console.error("Error closing WebSocket server:", err);
        }

        wss = undefined;
        clearIntervalAllInstruments();
        startWebSocketServer();
        console.log("WebSocket server restarted successfully");
      });
    } else {
      console.error("WebSocket server is not active" );
    }
  } else {
    startWebSocketServer();
    isServerRunning = true;
    console.log("WebSocket server started successfully");
  }
}

export const router = (server: any) => {
  // User routes
  server.post("/session/token", POSTSessionToken);
  server.post("/user/profile", GETUserProfile);
  server.get("/user/margins", GETUserMarginSegments);
  server.get("/user/margins/:segment", GETUserMarginSegments);
  server.delete("/session/token", DELETESessionToken);

  // Orders routes
  server.post("/orders/:variety", POSTOrderVariety);
  server.put("/orders/:variety/:order_id", PUTOrderVariety);
  server.delete("/orders/:variety/:order_id", DELETEOrderVariety);
  server.get("/orders", GETOrders);
  server.get("/generate-orders", generateAndInsertRandomOrders);
  server.get("/orders/:order_id", GETOrderById);
  server.get("/trades", GETTrades);
  server.get("/orders/:order_id/trades", GETOrderByIdTrades);

  // Portfolio
  server.get("/portfolio/holdings", GETHoldings);
  server.get("/portfolio/move-holdings", async (req: any, res: any) => {
    try {
      const client = await pool.connect();
      await calculateAndInsertHoldings(client);
      ;
      res
        .status(200)
        .json({ message: "Holdings moved and calculated successfully!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  server.get("/portfolio/positions", GETPositions);
  server.put("/portfolio/positions", PUTPositions);

  // Market quotes and instruments
  server.get("/instruments", GetInstruments);
  server.get("/instruments/:exchange", GetInstrumentsByExchange);
  server.get("/quote", GetQuotes);
  server.get("/quote/ohlc", GetQuotesOHLC);
  server.get("/quote/ltp", GetQuotesLTP);

  // Historical candle data
  server.get(
    "/instruments/historical/:instrument_token/:interval",
    GETCandleData
  );

  // Mutual funds
  server.post("/mf/orders", POSTMFOrders);
  server.delete("/mf/orders/:order_id", DELETEMFOrderById);
  server.get("/mf/orders", GETMFOrders);
  server.get("/mf/orders/:order_id", GETMFOrdersById);
  server.post("/mf/sips", POSTMFSips);
  server.put("/mf/sips/:order_id", PUTMFSipsByOrderId);
  server.delete("/mf/sips/:order_id", DELETEMFSipsByOrderId);
  server.get("/mf/sips/", GETMFSips);
  server.get("/mf/sips/:order_id", GETMFSipsByOrderId);
  server.get("/mf/holdings", GETMFHoldings);
  server.get("/mf/instruments", GETMFInstruments);

  // GTT - Good Till Triggered orders
  server.post("/gtt/triggers", POSTGTTtrigger);
  server.get("/gtt/triggers", GETGTTtrigger);
  server.get("/gtt/triggers/:id", GETGTTtriggerById);
  server.put("/gtt/triggers/:id", PUTGTTtriggerById);
  server.delete("/gtt/triggers/:id", DELETEGTTtriggerById);
  server.get("/start-websocket", (req: any, res: any) => {
    if (isServerRunning) {
      return res
        .status(200)
        .json({ message: "WebSocket server is already running" });
    }
    startWebSocketServer();
    isServerRunning = true;
    res.status(200).json({ message: "WebSocket server started successfully" });
  });
  server.get("/restart-websocket", (req: any, res: any) => {
    if (isServerRunning) {
      if (wss) {
        wss.close((err: any) => {
          if (err) {
            console.error("Error closing WebSocket server:", err);
            return res.status(500).json({ message: "Error stopping WebSocket server" });
          }
  
          wss = undefined;
          clearIntervalAllInstruments();
          startWebSocketServer();
          return res.status(200).json({ message: "WebSocket server restarted successfully" });
        });
      } else {
        return res.status(200).json({ message: "WebSocket server is not active" });
      }
    } else {
      startWebSocketServer();
      isServerRunning = true;
      return res.status(200).json({ message: "WebSocket server started successfully" });
    }
  });
  
  server.get("/stop-websocket", function (req: any, res: any) {
    if (wss) {
      wss.close((err: any) => {
        if (err) {
          console.error("Error closing WebSocket server:", err);
          res.status(500).json({ message: "Error stopping WebSocket server" });
        } else {
          wss = undefined; 
          clearIntervalAllInstruments();
          res
            .status(200)
            .json({ message: "WebSocket server stopped successfully" });
        }
      });
    } else {
      res.status(200).json({ message: "WebSocket server is not active" });
    }
  });
  server.get("/check-websocket", function (req: any, res: any) {
    if (isWebSocketActive(wss)) {
      res.status(200).json({ status: true, message: "WebSocket server is active" });
    } else {
      res.status(200).json({ status: false, message: "WebSocket server is not active" });
    }
  });
  startWebSocketServer();
};

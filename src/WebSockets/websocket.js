const WebSocket = require('ws');
const faker = require('faker');

const wss = new WebSocket.Server({ port: 8082 });

// Define instrument tokens and their price ranges
const instruments = [
  { instrument_token: 1233, min_price: 0.1, max_price: 200 },
  { instrument_token: 1222, min_price: 1, max_price: 300 },
];

const instrumentPrices = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Process the message and potentially send responses
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  instruments.forEach((instrument) => {
    const { instrument_token, min_price, max_price } = instrument;

    if (!instrumentPrices[instrument_token]) {
      instrumentPrices[instrument_token] = {
        price: min_price, // Initial price
        interval: setInterval(() => {
          const currentPrice = instrumentPrices[instrument_token].price;
          if (currentPrice < max_price) {
            const response = {
              instrument_token: instrument_token,
              last_price: currentPrice,
              timestamp: Date.now(),
            };
            ws.send(JSON.stringify(response));
            instrumentPrices[instrument_token].price += 0.1; // Increment price by 0.1
          } else {
            clearInterval(instrumentPrices[instrument_token].interval); // Stop when price reaches max_price
          }
        }, 10 * 60 * 1000), // 10 minutes interval
      };
    }
  });
});
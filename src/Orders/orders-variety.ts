const faker = require('faker');

// Function to generate random order ID
const generateRandomOrderID = (): string => {
  return faker.random.number().toString();
};

// Function to handle POST request for POSTOrderVariety
export const POSTOrderVariety = (request: any, response: any) => {
  const orderID = generateRandomOrderID(); // Generating random order ID
  response.status(200).jsonp({
    "status": "success",
    "data": {
      "order_id": orderID
    }
  });
};

// Function to handle PUT request for PUTOrderVariety
export const PUTOrderVariety = (request: any, response: any) => {
  const orderID = generateRandomOrderID(); // Generating random order ID
  response.status(200).jsonp({
    "status": "success",
    "data": {
      "order_id": orderID
    }
  });
};

// Function to handle DELETE request for DELETEOrderVariety
export const DELETEOrderVariety = (request: any, response: any) => {
  const orderID = generateRandomOrderID(); // Generating random order ID
  response.status(200).jsonp({
    "COLLABORATION-NEEDED": "Please contribute the request body handling logic https://github.com/nordible/zerodha-sandbox/pulls",
    "status": "success",
    "data": {
      "order_id": orderID
    }
  });
};

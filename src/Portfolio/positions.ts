const pool = require('../db');

// Function to handle GET request for retrieving positions from database
export const GETPositions = async (request: any, response: any) => {
  try {
    const client = await pool.connect();

    // Retrieve specific fields from portfolio_positions table joined with orders table
    const positionsQuery = `
      SELECT 
        o.tradingsymbol, 
        o.exchange, 
        o.instrument_token, 
        o.product, 
        o.price, 
        o.quantity, 
        o.average_price, 
        pp.close_price, 
        pp.pnl, 
        pp.value AS m2m, 
        pp.unrealised, 
        pp.realised 
      FROM 
        portfolio_positions pp 
      INNER JOIN 
        orders o ON pp.order_id = o.order_id`;

    const positionsResult = await client.query(positionsQuery);

    const positionsData = positionsResult.rows.map((row: any) => ({
      tradingsymbol: row.tradingsymbol,
      exchange: row.exchange,
      instrument_token: row.instrument_token,
      isin: 0, // Replace with actual logic to calculate
      product: row.product,
      price: row.price,
      quantity: row.quantity,
      used_quantity: 0, // Replace with actual logic to calculate used_quantity
      t1_quantity: 0, // Replace with actual logic to calculate t1_quantity
      realised_quantity: row.quantity, // Assuming this is the same as the quantity
      authorised_quantity: 0, // Replace with actual authorised_quantity
      authorised_date: '2021-06-08 00:00:00', // Replace with actual authorised_date
      opening_quantity: row.quantity, // Assuming this is the same as the quantity
      collateral_quantity: 0, // Replace with actual collateral_quantity
      collateral_type: '', // Replace with actual collateral_type
      discrepancy: false, // Replace with actual discrepancy logic
      average_price: row.average_price,
      last_price: row.close_price, // Assuming close_price is the last_price
      close_price: row.close_price,
      pnl: row.pnl,
      day_change: 0, // Placeholder for day_change
      day_change_percentage: 0, // Placeholder for day_change_percentage
      m2m: row.m2m,
      unrealised: row.unrealised,
      realised: row.realised,
    }));

    response.status(200).jsonp({
      "status": "success",
      "data": positionsData,
    });

    client.release();
  } catch (error) {
    console.error('Error retrieving positions:', error);
    response.status(500).jsonp({ "status": "error", "message": "Internal server error" });
  }
};


export const PUTPositions = async (request: any, response: any) => {
  try {
    const { tradingsymbol, exchange, transaction_type, position_type, quantity, old_product, new_product } = request.body;
    const client = await pool.connect();
    await client.query(`
      INSERT INTO portfolio_positions (
        tradingsymbol, exchange, transaction_type, position_type, quantity, old_product, new_product
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
      tradingsymbol, exchange, transaction_type, position_type, quantity, old_product, new_product
    ]);

    console.log('New positions inserted into the database successfully.');

    client.release();

    response.status(200).jsonp({
      "status": "success",
      "data": true
    });
  } catch (error) {
    console.error('Error inserting new positions:', error);
    response.status(500).jsonp({ "status": "error", "message": "Internal server error" });
  }
};
const pool = require('../db');

// Function to handle GET request for retrieving positions from database
export const GETPositions = async (request: any, response: any) => {
  try {
    const { authorization } = request.headers;

    // Extract user_id from the authorization header or token
    const tokenParts = authorization.split(' ');
    const [apiKey, accessToken] = tokenParts[tokenParts.length - 1].split(':');

    const client = await pool.connect();

     // Fetch user_id based on the provided api_key and access_token
     const userQuery = await client.query(
      'SELECT id FROM users WHERE api_key = $1 AND access_token = $2',
      [apiKey, accessToken]
    );
    const user = userQuery.rows[0];

    if (!user) {
      response.status(401).jsonp({
        "status": "error",
        "message": "Unauthorized access",
      });
      ;
      return;
    }

    const positionsQuery = {
      text: `
        SELECT 
          o.instrument_token,
          MAX(o.tradingsymbol) AS tradingsymbol,
          MAX(o.exchange) AS exchange,
          MAX(o.product) AS product,
          MAX(o.price) AS price,
          SUM(CASE WHEN o.transaction_type = 'BUY' THEN o.quantity ELSE -o.quantity END) AS total_quantity,
          MAX(o.average_price) AS average_price,
          MAX(pp.close_price) AS close_price,
          MAX(pp.pnl) AS pnl,
          MAX(pp.value) AS m2m,
          MAX(pp.unrealised) AS unrealised,
          MAX(pp.realised) AS realised
        FROM 
          orders o
        INNER JOIN 
          portfolio_positions pp ON pp.order_id = o.id
        WHERE 
          o.user_id = $1
        GROUP BY 
          o.instrument_token
      `,
      values: [user.id],
    };
    
    const positionsResult = await client.query(positionsQuery);
    
    const positionsData = positionsResult.rows.map((row: any) => ({
      tradingsymbol: row.tradingsymbol,
      exchange: row.exchange,
      instrument_token: row.instrument_token,
      isin: 0, // Replace with actual logic to calculate
      product: row.product,
      price: row.price,
      quantity: parseFloat(row.total_quantity), // Assuming the quantity is numeric, convert if necessary
      used_quantity: 0, // Replace with actual logic to calculate used_quantity
      t1_quantity: 0, // Replace with actual logic to calculate t1_quantity
      realised_quantity: parseFloat(row.total_quantity), // Assuming this is the same as the total_quantity
      authorised_quantity: 0, // Replace with actual authorised_quantity
      authorised_date: '2021-06-08 00:00:00', // Replace with actual authorised_date
      opening_quantity: parseFloat(row.total_quantity), // Assuming this is the same as the total_quantity
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
      "data": {
        "net": positionsData
      },
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

    ;

    response.status(200).jsonp({
      "status": "success",
      "data": true
    });
    client.release();
  } catch (error) {
    console.error('Error inserting new positions:', error);
    response.status(500).jsonp({ "status": "error", "message": "Internal server error" });
  }
};
const pool = require('../db');
// Function to handle GET request for retrieving holdings from database
export const GETHoldings = async (request: any, response: any) => {
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
    const holdingsQuery = {
      text: `
        SELECT 
          o.instrument_token, 
          MAX(o.tradingsymbol) AS tradingsymbol,
          MAX(o.exchange) AS exchange,
          MAX(o.product) AS product, 
          MAX(o.price) AS price, 
          SUM(CASE WHEN o.transaction_type = 'BUY' THEN o.quantity ELSE -o.quantity END) AS total_quantity,
          MAX(o.average_price) AS average_price, 
          MAX(ph.close_price) AS close_price, 
          MAX(ph.pnl) AS pnl, 
          MAX(ph.day_change) AS day_change, 
          MAX(ph.day_change_percentage) AS day_change_percentage
        FROM 
          portfolio_holdings ph 
        INNER JOIN 
          orders o ON ph.instrument_token = o.instrument_token
        WHERE 
          o.user_id = $1
        GROUP BY 
          o.instrument_token, ph.quantity
      `,
      values: [user.id],
    };
    
    const holdingsResult = await client.query(holdingsQuery);

    const holdingsData = holdingsResult.rows.map((row: any) => ({
      tradingsymbol: row.tradingsymbol,
      exchange: row.exchange,
      instrument_token: row.instrument_token,
      isin: 0, // Replace with actual logic to calculate
      product: row.product,
      price: parseFloat(row.price),
      quantity: parseFloat(row.total_quantity), // Assuming the quantity is numeric, convert if necessary
      used_quantity: 0, // Replace with actual logic to calculate used_quantity
      t1_quantity: 0, // Replace with actual logic to calculate t1_quantity
      realised_quantity: parseFloat(row.total_quantity), // Assuming this is the same as the total_quantity
      authorised_quantity: 0,
      authorised_date: '2021-06-08 00:00:00',
      opening_quantity: parseFloat(row.total_quantity), // Assuming this is the same as the total_quantity
      collateral_quantity: 0, // Replace with actual collateral_quantity
      collateral_type: '', // Replace with actual collateral_type
      discrepancy: false, // Replace with actual discrepancy logic
      average_price: parseFloat(row.average_price),
      last_price: parseFloat(row.close_price), // Assuming close_price is the last_price
      close_price: parseFloat(row.close_price),
      pnl: parseFloat(row.pnl),
      day_change: row.day_change,
      day_change_percentage: row.day_change_percentage,
    }));
    console.log(holdingsData);
    response.status(200).jsonp({
      "status": "success",
      "data": holdingsData,
    });


    client.release();
  } catch (error) {
    console.error('Error retrieving holdings:', error);
    response.status(500).jsonp({ "status": "error", "message": "Internal server error" });
  }
};

export const calculateAndInsertHoldings = async (client: any) => {
  try {
    // Fetch instrument_tokens that are not present in portfolio_holdings
    const unprocessedOrdersQuery = `
      SELECT DISTINCT o.instrument_token
      FROM orders o
      LEFT JOIN portfolio_holdings ph ON o.instrument_token = ph.instrument_token
      WHERE o.quantity != 0
    `;

    const unprocessedOrdersResult = await client.query(unprocessedOrdersQuery);
    const unprocessedInstrumentTokens = unprocessedOrdersResult.rows.map((row: any) => row.instrument_token);
    // Iterate through unprocessed instrument_tokens and calculate/insert/update holdings
    for (const instrumentToken of unprocessedInstrumentTokens) {
      // Begin a transaction
      await client.query('BEGIN');

      // Calculate and insert/update data into holdings table for a specific instrument_token
      const insertOrUpdateQuery = `
  INSERT INTO portfolio_holdings (
    instrument_token,
    average_price,
    close_price,
    pnl,
    day_change,
    day_change_percentage,
    created_at
  )
  SELECT
    o.instrument_token,
    AVG(o.price) AS average_price,
    MAX(o.price) AS close_price,
    SUM(CASE WHEN o.transaction_type = 'BUY' THEN o.quantity ELSE -o.quantity END * o.price) AS pnl,
    0 AS day_change,
    0 AS day_change_percentage,
    CURRENT_TIMESTAMP AS created_at
  FROM
    orders o
  WHERE
    o.instrument_token = $1
  GROUP BY
    o.instrument_token
  ON CONFLICT (instrument_token)
  DO UPDATE SET
    average_price = EXCLUDED.average_price,
    close_price = EXCLUDED.close_price,
    pnl = EXCLUDED.pnl,
    created_at = EXCLUDED.created_at,
    quantity = portfolio_holdings.quantity + EXCLUDED.quantity;
`;

      // Execute the insert/update query with the current instrument_token
      await client.query(insertOrUpdateQuery, [instrumentToken]);

      // Remove the processed entries from the positions table
      const deleteQuery = `
        DELETE FROM portfolio_positions
        WHERE order_id IN (
          SELECT id
          FROM orders
          WHERE instrument_token = $1
        )
      `;
      await client.query(deleteQuery, [instrumentToken]);

      // Commit the transaction
      await client.query('COMMIT');

      console.log(`Holdings calculated and inserted/updated for instrument_token: ${instrumentToken} successfully. Entries removed from positions.`);
    }

    console.log("All unprocessed instrument_tokens have been handled.");
    client.release();
  } catch (error) {
    console.error('Error processing unprocessed instrument_tokens:', error);
  }
};


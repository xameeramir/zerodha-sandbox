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
          orders o ON ph.order_id = o.id
        WHERE 
          o.user_id = $1
        GROUP BY 
          o.instrument_token
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
      authorised_date: 0,
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
    // Fetch order IDs that are not present in portfolio_holdings
    const unprocessedOrdersQuery = `
      SELECT DISTINCT o.id
      FROM orders o
      LEFT JOIN portfolio_holdings ph ON o.id = ph.order_id
      WHERE ph.order_id IS NULL
    `;

    const unprocessedOrdersResult = await client.query(unprocessedOrdersQuery);
    const unprocessedOrders = unprocessedOrdersResult.rows.map((row: any) => row.id);

    // Iterate through unprocessed order IDs and calculate/insert holdings
    for (const orderID of unprocessedOrders) {
      // Begin a transaction
      await client.query('BEGIN');

      // Calculate and insert data into holdings table for a specific order_id
      const insertQuery = `
        INSERT INTO portfolio_holdings (
          order_id,
          average_price,
          close_price,
          pnl,
          day_change,
          day_change_percentage,
          created_at
        )
        SELECT
          o.id,
          -- Replace with your calculation logic for average_price, close_price, pnl, day_change, day_change_percentage
          AVG(o.price) AS average_price,
          MAX(o.price) AS close_price,
          SUM(CASE WHEN o.transaction_type = 'BUY' THEN o.quantity ELSE -o.quantity END * o.price) AS pnl,
          -- Calculation logic for day_change and day_change_percentage can be placed here
          0 AS day_change,
          0 AS day_change_percentage,
          CURRENT_TIMESTAMP AS created_at
        FROM
          orders o
        WHERE
          o.id = $1
        GROUP BY
          o.id
      `;

      // Execute the insert query with the current order_id
      await client.query(insertQuery, [orderID]);

      // Remove the processed entry from the positions table
      const deleteQuery = `
        DELETE FROM portfolio_positions
        WHERE order_id = $1
      `;
      await client.query(deleteQuery, [orderID]);

      // Commit the transaction
      await client.query('COMMIT');

      console.log(`Holdings calculated and inserted for order_id: ${orderID} successfully. Entry removed from positions.`);
    }

    console.log("All unprocessed orders have been handled.");
    client.release();
  } catch (error) {
    console.error('Error processing unprocessed orders:', error);
  }
};

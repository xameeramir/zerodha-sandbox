// Function to handle GET request for retrieving holdings from database
export const GETHoldings = async (request: any, response: any) => {
  try {
    const client = await pool.connect();
    // Retrieve holdings data from the portfolio_holdings table
    const holdingsQuery = 'SELECT * FROM portfolio_holdings';
    const holdingsResult = await client.query(holdingsQuery);

    const holdingsData = holdingsResult.rows;
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
      SELECT DISTINCT o.order_id
      FROM orders o
      LEFT JOIN portfolio_holdings ph ON o.order_id = ph.order_id
      WHERE ph.order_id IS NULL
    `;

    const unprocessedOrdersResult = await client.query(unprocessedOrdersQuery);
    const unprocessedOrders = unprocessedOrdersResult.rows.map((row: any) => row.order_id);

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
          o.order_id,
          -- Replace with your calculation logic for average_price, close_price, pnl, day_change, day_change_percentage
          AVG(o.price) AS average_price,
          MAX(o.price) AS close_price,
          SUM(CASE WHEN o.transaction_type = 'SELL' THEN (o.quantity * o.price - o.quantity * o.average_price) ELSE 0 END) AS pnl,
          -- Calculation logic for day_change and day_change_percentage can be placed here
          0 AS day_change,
          0 AS day_change_percentage,
          CURRENT_TIMESTAMP AS created_at
        FROM
          orders o
        WHERE
          o.order_id = $1
        GROUP BY
          o.order_id
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
  } catch (error) {
    console.error('Error processing unprocessed orders:', error);
  }
};


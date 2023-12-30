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

const calculateAndInsertHoldings = async (client: any, orderID: any) => {
  try {
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

    // Execute the insert query with the specified order_id
    await client.query(insertQuery, [orderID]);

    // Commit the transaction
    await client.query('COMMIT');

    console.log(`Holdings calculated and inserted for order_id: ${orderID} successfully.`);
  } catch (error) {
    console.error(`Error calculating and inserting holdings for order_id: ${orderID}`, error);
  }
};

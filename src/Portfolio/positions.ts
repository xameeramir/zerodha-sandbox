// Function to handle GET request for retrieving positions from database
export const GETPositions = async (request: any, response: any) => {
  try {
    const client = await pool.connect();

    // Retrieve positions data from the portfolio_positions table
    const positionsQuery = 'SELECT * FROM portfolio_positions';
    const positionsResult = await client.query(positionsQuery);

    const positionsData = positionsResult.rows;
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
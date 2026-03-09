const pool = require("../config/db");

const BatchModel = {

  async getByProduct(productId) {

    const query = `
      SELECT
        id,
        batch_number,
        available_qty,
        quantity,
        purchase_price,
        expiry_date,
        arrival_date
      FROM batches
      WHERE product_id = $1
      ORDER BY expiry_date ASC
    `;

    const { rows } = await pool.query(query, [productId]);

    return rows;

  }

};

module.exports = BatchModel;
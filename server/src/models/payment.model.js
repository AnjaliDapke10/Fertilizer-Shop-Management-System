const pool = require("../config/db");

const PaymentModel = {
  async createPayment(data) {
    const {
      customer_id,
      sale_id,
      amount,
      payment_date,
      method
    } = data;

    const query = `
      INSERT INTO payments
      (customer_id, sale_id, amount, payment_date, method)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      customer_id,
      sale_id || null,
      amount,
      payment_date,
      method
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = PaymentModel;

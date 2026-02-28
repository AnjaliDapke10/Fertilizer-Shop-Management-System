const pool = require("../config/db");

const CustomerModel = {
  async getAll() {
    const query = `
      SELECT id, name, phone, email, gstin, created_at
      FROM customers
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async create(data) {
    const { name, phone, email, address, gstin } = data;

    const query = `
      INSERT INTO customers (name, phone, email, address, gstin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [name, phone, email, address, gstin];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getOutstanding(customerId) {
    const query = `
      SELECT * FROM customer_outstanding
      WHERE customer_id = $1
    `;
    const { rows } = await pool.query(query, [customerId]);
    return rows[0];
  }
};

module.exports = CustomerModel;

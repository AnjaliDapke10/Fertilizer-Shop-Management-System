const pool = require("../config/db");

const SupplierModel = {
  async getAll() {
    const query = `
      SELECT id, name, phone, email, gstin, created_at
      FROM suppliers
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async create(data) {
    const { name, phone, email, address, gstin } = data;

    const query = `
      INSERT INTO suppliers (name, phone, email, address, gstin)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [name, phone, email, address, gstin];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = SupplierModel;

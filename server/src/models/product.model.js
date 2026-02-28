const pool = require("../config/db");

const ProductModel = {
  async getAll() {
    const query = `
      SELECT 
        id,
        name,
        description,
        npk_ratio,
        unit,
        gst_rate,
        reorder_level,
        is_active,
        created_at
      FROM products
      ORDER BY created_at DESC
    `;
    const { rows } = await pool.query(query);
    return rows;
  },
  async create(data) {
    const {
      name,
      description,
      npk_ratio,
      unit,
      gst_rate,
      reorder_level
    } = data;

    const query = `
      INSERT INTO products
      (name, description, npk_ratio, unit, gst_rate, reorder_level)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      name,
      description || null,
      npk_ratio || null,
      unit || "kg",
      gst_rate || 18,
      reorder_level || 0
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = ProductModel;



const pool = require("../config/db");

const ProductModel = {
  async getAll() {
  const query = `
    SELECT
      p.id,
      p.name,
      p.description,
      p.npk_ratio,
      p.unit,
      p.gst_rate,
      p.reorder_level,
      p.is_active,
      p.created_at,

      COALESCE(s.total_stock,0) AS stock,
      s.nearest_expiry

    FROM products p
    LEFT JOIN stock_summary s
      ON p.id = s.product_id

    ORDER BY p.created_at DESC
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
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
  `;

  const values = [
    name.trim(),
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



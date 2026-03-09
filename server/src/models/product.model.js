const pool = require("../config/db");

const ProductModel = {

  async getAll() {

    const query = `
      SELECT
        p.id,
        p.name,
        p.npk_ratio,
        p.unit,
        p.gst_rate,
        p.reorder_level,
        COALESCE(s.total_stock,0) AS stock,
        s.nearest_expiry
      FROM products p
      LEFT JOIN stock_summary s
        ON p.id = s.product_id
      ORDER BY p.name
    `;

    const { rows } = await pool.query(query);

    return rows;

  },

  async create(data) {

    const {
      name,
      npk_ratio,
      unit,
      gst_rate,
      reorder_level
    } = data;

    const query = `
      INSERT INTO products
      (name, npk_ratio, unit, gst_rate, reorder_level)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
    `;

    const values = [
      name,
      npk_ratio,
      unit,
      gst_rate,
      reorder_level
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];

  },

  async delete(id) {

  const query = `
    DELETE FROM products
    WHERE id = $1
  `;

  await pool.query(query, [id]);

},

async update(id, data) {

  const { name, npk_ratio, unit, gst_rate, reorder_level } = data;

  const query = `
    UPDATE products
    SET
      name=$1,
      npk_ratio=$2,
      unit=$3,
      gst_rate=$4,
      reorder_level=$5
    WHERE id=$6
    RETURNING *
  `;

  const { rows } = await pool.query(query, [
    name,
    npk_ratio,
    unit,
    gst_rate,
    reorder_level,
    id
  ]);

  return rows[0];
}

};

module.exports = ProductModel;
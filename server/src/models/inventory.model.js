const pool = require('../config/db');

const InventoryModel = {

async getLowStock() {
    const query = `
        SELECT
            p.id,
            p.name,
            ss.total_stock,
            p.reorder_level
        FROM products p
        JOIN stock_summary ss ON p.id = ss.product_id
        WHERE ss.total_stock < p.reorder_level
    `;

    const { rows } = await pool.query(query);
    return rows;
},

async getNearExpiry(days = 30) {

    const query = `
        SELECT
            b.id AS batch_id,
            p.name AS product_name,
            b.expiry_date,
            b.available_qty
        FROM batches b
        JOIN products p ON b.product_id = p.id
        WHERE b.available_qty > 0
        AND b.expiry_date <= CURRENT_DATE + ($1 || ' days')::interval
        ORDER BY b.expiry_date ASC
    `;

    const { rows } = await pool.query(query, [days]);
    return rows;
},

async getStockAging() {

  const query = `
    SELECT
      p.name,
      b.batch_number,
      b.arrival_date,
      b.available_qty,
      CURRENT_DATE - b.arrival_date AS age_in_days
    FROM batches b
    JOIN products p ON p.id = b.product_id
    WHERE b.available_qty > 0
    ORDER BY age_in_days DESC
  `;

  const { rows } = await pool.query(query);
  return rows;
},

async getAvailableProducts() {

  const query = `
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      SUM(b.available_qty) AS available_qty,
      MAX(b.purchase_price) AS selling_price
    FROM products p
    JOIN batches b ON b.product_id = p.id
    WHERE b.available_qty > 0
    GROUP BY p.id, p.name
    ORDER BY p.name
  `;

  const { rows } = await pool.query(query);
  return rows;
},
async getInventorySummary() {

  const query = `
    SELECT
      p.id,
      p.name,
      p.reorder_level,
      COALESCE(SUM(b.available_qty),0) AS available_qty
    FROM products p
    LEFT JOIN batches b
      ON b.product_id = p.id
    GROUP BY p.id
    ORDER BY p.name
  `;

  const { rows } = await pool.query(query);
  return rows;
}

};

module.exports = InventoryModel;
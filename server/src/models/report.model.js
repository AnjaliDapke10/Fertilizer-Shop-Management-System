const pool = require("../config/db");

const ReportModel = {
  async getSalesReport(from, to) {
    const query = `
      SELECT
        s.id AS sale_id,
        s.invoice_number,
        s.sale_date,
        c.name AS customer_name,
        s.total_amount
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      WHERE s.sale_date BETWEEN $1 AND $2
      ORDER BY s.sale_date DESC
    `;
    const { rows } = await pool.query(query, [from, to]);
    return rows;
  },
  async getPurchaseReport(from, to) {
  const query = `
    SELECT
      p.id,
      p.invoice_number,
      p.purchase_date,
      s.name AS supplier_name,
      p.total_amount
    FROM purchases p
    LEFT JOIN suppliers s ON s.id = p.supplier_id
    WHERE p.purchase_date BETWEEN $1 AND $2
    ORDER BY p.purchase_date DESC
  `;
  const { rows } = await pool.query(query, [from, to]);
  return rows;
},
async getStockValuation() {
  const query = `
    SELECT
      p.name,
      SUM(b.available_qty * b.purchase_price) AS stock_value
    FROM batches b
    JOIN products p ON p.id = b.product_id
    WHERE b.available_qty > 0
    GROUP BY p.name
  `;
  const { rows } = await pool.query(query);
  return rows;
},
async getProfitLoss() {
  const query = `
    SELECT
      (SELECT COALESCE(SUM(total_amount),0) FROM sales) -
      (SELECT COALESCE(SUM(total_amount),0) FROM purchases)
      AS profit_or_loss
  `;
  const { rows } = await pool.query(query);
  return rows[0];
},
async getGstSummary() {
  const query = `
    SELECT SUM(gst_amount) AS total_gst_collected
    FROM sales
  `;
  const { rows } = await pool.query(query);
  return rows[0];
}



};

module.exports = ReportModel;

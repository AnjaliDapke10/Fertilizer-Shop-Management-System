const pool = require("../config/db");
const allocateFIFO = require("../utils/fifoAllocator");

const SaleModel = {
  async getAllSales() {
  const { rows } = await pool.query(`
    SELECT
      s.id,
      s.invoice_number,
      s.sale_date,
      s.total_amount,
      s.created_at,

      c.name AS customer_name,

      COALESCE(
        (
          SELECT p.method
          FROM payments p
          WHERE p.sale_id = s.id
          ORDER BY p.payment_date DESC
          LIMIT 1
        ),
        'cash'
      ) AS payment_method,

      CASE
        WHEN COALESCE(
          (
            SELECT SUM(p.amount)
            FROM payments p
            WHERE p.sale_id = s.id
          ), 0
        ) >= s.total_amount
        THEN 'completed'
        ELSE 'pending'
      END AS status

    FROM sales s
    LEFT JOIN customers c ON c.id = s.customer_id
    ORDER BY s.sale_date DESC
  `);

  return rows;


},
  async createSale(data) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const {
        customer_id,
        sale_date,
        invoice_number,
        items
      } = data;

      // 1️⃣ Create sale
      const saleRes = await client.query(
        `
        INSERT INTO sales
        (customer_id, sale_date, invoice_number, total_amount)
        VALUES ($1, $2, $3, 0)
        RETURNING id
        `,
        [customer_id, sale_date, invoice_number]
      );

      const saleId = saleRes.rows[0].id;
      let totalAmount = 0;

      // 2️⃣ FIFO per product
      for (const item of items) {
        const { product_id, quantity, selling_price } = item;

        const allocations = await allocateFIFO(
          client,
          product_id,
          quantity
        );

        for (const alloc of allocations) {
          // Deduct batch stock
          await client.query(
            `
            UPDATE batches
            SET available_qty = available_qty - $1
            WHERE id = $2
            `,
            [alloc.quantity, alloc.batch_id]
          );

          // Sale item
          await client.query(
            `
            INSERT INTO sale_items
            (sale_id, product_id, batch_id, quantity, price_per_unit)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [saleId, product_id, alloc.batch_id, alloc.quantity, selling_price]
          );

          // Ledger OUT
          await client.query(
            `
            INSERT INTO inventory_ledger
            (product_id, batch_id, transaction_type, quantity, reference_type, reference_id)
            VALUES ($1, $2, 'OUT', $3, 'SALE', $4)
            `,
            [product_id, alloc.batch_id, alloc.quantity, saleId]
          );

          totalAmount += alloc.quantity * selling_price;
        }
      }

      // 3️⃣ Update sale total
      await client.query(
        `UPDATE sales SET total_amount = $1 WHERE id = $2`,
        [totalAmount, saleId]
      );

      await client.query("COMMIT");

      return { sale_id: saleId, total_amount: totalAmount };

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
  async getSaleById(saleId) {
  const saleRes = await pool.query(
    `
    SELECT
      s.id,
      s.invoice_number,
      s.sale_date,
      s.total_amount,
      s.status,
      c.id AS customer_id,
      c.name AS customer_name,
      c.phone
    FROM sales s
    LEFT JOIN customers c ON c.id = s.customer_id
    WHERE s.id = $1
    `,
    [saleId]
  );

  if (!saleRes.rows.length) return null;

  const itemsRes = await pool.query(
    `
    SELECT
      p.name AS product_name,
      b.batch_number,
      si.quantity,
      si.price_per_unit,
      (si.quantity * si.price_per_unit) AS line_total
    FROM sale_items si
    JOIN products p ON p.id = si.product_id
    JOIN batches b ON b.id = si.batch_id
    WHERE si.sale_id = $1
    `,
    [saleId]
  );

  const paymentRes = await pool.query(
    `
    SELECT
      amount,
      method,
      payment_date
    FROM payments
    WHERE sale_id = $1
    ORDER BY payment_date
    `,
    [saleId]
  );

  return {
    sale: saleRes.rows[0],
    items: itemsRes.rows,
    payments: paymentRes.rows
  };
}

};

module.exports = SaleModel;

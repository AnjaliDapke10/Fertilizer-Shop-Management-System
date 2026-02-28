const pool = require("../config/db");

const PurchaseModel = {
  async createPurchase(data) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const {
        supplier_id,
        purchase_date,
        invoice_number,
        items
      } = data;

      // 1️⃣ Create purchase
      const purchaseQuery = `
        INSERT INTO purchases
        (supplier_id, purchase_date, invoice_number, total_amount, gst_amount)
        VALUES ($1, $2, $3, 0, 0)
        RETURNING id
      `;

      const purchaseRes = await client.query(purchaseQuery, [
        supplier_id,
        purchase_date,
        invoice_number
      ]);

      const purchaseId = purchaseRes.rows[0].id;

      let totalAmount = 0;

      // 2️⃣ Create batches + ledger
      for (const item of items) {
        const {
          product_id,
          batch_number,
          expiry_date,
          quantity,
          purchase_price
        } = item;

        const batchQuery = `
          INSERT INTO batches
          (product_id, purchase_id, batch_number, arrival_date, expiry_date,
           quantity, available_qty, purchase_price)
          VALUES ($1, $2, $3, CURRENT_DATE, $4, $5, $5, $6)
          RETURNING id
        `;

        const batchRes = await client.query(batchQuery, [
          product_id,
          purchaseId,
          batch_number,
          expiry_date,
          quantity,
          purchase_price
        ]);

        const batchId = batchRes.rows[0].id;

        // Ledger IN
        const ledgerQuery = `
          INSERT INTO inventory_ledger
          (product_id, batch_id, transaction_type, quantity, reference_type, reference_id)
          VALUES ($1, $2, 'IN', $3, 'PURCHASE', $4)
        `;

        await client.query(ledgerQuery, [
          product_id,
          batchId,
          quantity,
          purchaseId
        ]);

        totalAmount += quantity * purchase_price;
      }

      // 3️⃣ Update purchase total
      await client.query(
        `UPDATE purchases SET total_amount = $1 WHERE id = $2`,
        [totalAmount, purchaseId]
      );

      await client.query("COMMIT");

      return { purchase_id: purchaseId, total_amount: totalAmount };

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
};

module.exports = PurchaseModel;

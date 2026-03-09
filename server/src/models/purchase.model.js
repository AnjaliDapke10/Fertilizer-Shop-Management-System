const pool = require("../config/db");

const PurchaseModel = {
  async createPurchase(data) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { supplier_id, purchase_date, items } = data;

      const invoice_number = await this.generateInvoice(client);

      // 1️⃣ Create purchase
     const purchaseQuery = `
  INSERT INTO purchases
  (
    supplier_id,
    invoice_number,
    purchase_date,
    total_amount,
    gst_amount
  )
  VALUES
  (
    $1,
    'PUR-' || LPAD(nextval('purchase_invoice_seq')::text,5,'0'),
    $2,
    0,
    0
  )
  RETURNING id, invoice_number
`;

      const purchaseRes = await client.query(purchaseQuery, [
  supplier_id,
  purchase_date
]);

const purchaseId = purchaseRes.rows[0].id;
const invoiceNumber = purchaseRes.rows[0].invoice_number;

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
  },
  async getPurchases() {
  const query = `
    SELECT
      p.id,
      p.invoice_number,
      p.purchase_date,
      p.total_amount,
      s.name AS supplier_name,
      COUNT(b.id) AS items_count
    FROM purchases p
    LEFT JOIN suppliers s ON s.id = p.supplier_id
    LEFT JOIN batches b ON b.purchase_id = p.id
    GROUP BY p.id, s.name
    ORDER BY p.purchase_date DESC
  `;

  const { rows } = await pool.query(query);
  return rows;
},

async getPurchaseDetails(purchaseId) {
  const query = `
    SELECT
      p.invoice_number,
      p.purchase_date,
      s.name AS supplier_name,

      pr.name AS product_name,
      b.batch_number,
      b.expiry_date,
      b.quantity,
      b.purchase_price

    FROM purchases p

    JOIN suppliers s ON s.id = p.supplier_id
    JOIN batches b ON b.purchase_id = p.id
    JOIN products pr ON pr.id = b.product_id

    WHERE p.id = $1
  `;

  const { rows } = await pool.query(query, [purchaseId]);

  return rows;
},

async deletePurchase(id) {

  await pool.query(
    `DELETE FROM purchases WHERE id=$1`,
    [id]
  );

},

async updatePurchase(id, data) {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const {
      supplier_id,
      purchase_date,
      invoice_number,
      items
    } = data;

    await client.query(
      `
      UPDATE purchases
      SET supplier_id=$1,
          purchase_date=$2,
          invoice_number=$3
      WHERE id=$4
      `,
      [supplier_id, purchase_date, invoice_number, id]
    );

    await client.query(
      `DELETE FROM batches WHERE purchase_id=$1`,
      [id]
    );

    let total = 0;

    for (const item of items) {

      const {
        product_id,
        batch_number,
        expiry_date,
        quantity,
        purchase_price
      } = item;

      const batch = await client.query(
        `
        INSERT INTO batches
        (product_id,purchase_id,batch_number,arrival_date,expiry_date,
        quantity,available_qty,purchase_price)
        VALUES ($1,$2,$3,CURRENT_DATE,$4,$5,$5,$6)
        RETURNING id
        `,
        [
          product_id,
          id,
          batch_number,
          expiry_date,
          quantity,
          purchase_price
        ]
      );

      await client.query(
        `
        INSERT INTO inventory_ledger
        (product_id,batch_id,transaction_type,quantity,reference_type,reference_id)
        VALUES ($1,$2,'IN',$3,'PURCHASE',$4)
        `,
        [product_id, batch.rows[0].id, quantity, id]
      );

      total += quantity * purchase_price;

    }

    await client.query(
      `UPDATE purchases SET total_amount=$1 WHERE id=$2`,
      [total, id]
    );

    await client.query("COMMIT");

    return { updated: true };

  } catch (err) {

    await client.query("ROLLBACK");
    throw err;

  } finally {

    client.release();

  }

},
async generateInvoice(client) {

  const res = await client.query(
    `SELECT COUNT(*) FROM purchases`
  );

  const count = Number(res.rows[0].count) + 1;

  return `PUR-${String(count).padStart(5,"0")}`;

}
};

module.exports = PurchaseModel;

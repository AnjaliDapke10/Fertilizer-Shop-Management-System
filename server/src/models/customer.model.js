const pool = require("../config/db");

const CustomerModel = {

  async getAll() {

    const query = `
      SELECT 
        c.id,
        c.name,
        c.phone,
        c.email,
        c.address,
        c.gstin,
        COALESCE(o.outstanding_amount,0) AS credit_balance,
        c.created_at
      FROM customers c
      LEFT JOIN customer_outstanding o
        ON c.id = o.customer_id
      WHERE c.is_active = true
      ORDER BY c.created_at DESC
    `;

    const { rows } = await pool.query(query);
    return rows;
  },

  async create(data) {

    const { name, phone, email, address, gstin } = data;

    const query = `
      INSERT INTO customers (name, phone, email, address, gstin)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
    `;

    const values = [name, phone, email, address, gstin];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  async update(id, data) {

  const { name, phone, email, address, gstin } = data;

  const query = `
    UPDATE customers
    SET name=$1,
        phone=$2,
        email=$3,
        address=$4,
        gstin=$5,
        updated_at = CURRENT_TIMESTAMP
    WHERE id=$6
    RETURNING *
  `;

  const values = [name, phone, email, address, gstin, id];

  const { rows } = await pool.query(query, values);
  return rows[0];
},
async delete(id) {

  const query = `
    UPDATE customers
    SET is_active = false
    WHERE id = $1
  `;

  await pool.query(query, [id]);
}

};

module.exports = CustomerModel;
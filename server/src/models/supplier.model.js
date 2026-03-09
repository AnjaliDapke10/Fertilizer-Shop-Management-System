const pool = require("../config/db");

const SupplierModel = {

  async getAll() {
    const query = `
      SELECT 
        id,
        name,
        contact_person,
        phone,
        email,
        address,
        gstin,
        created_at
      FROM suppliers
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);
    return rows;
  },

  async create(data) {
    const { name, contact_person, phone, email, address, gstin } = data;

    const query = `
      INSERT INTO suppliers
      (name, contact_person, phone, email, address, gstin)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `;

    const values = [name, contact_person, phone, email, address, gstin];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async update(id, data) {

    const { name, contact_person, phone, email, address, gstin } = data;

    const query = `
      UPDATE suppliers
      SET
        name=$1,
        contact_person=$2,
        phone=$3,
        email=$4,
        address=$5,
        gstin=$6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id=$7
      RETURNING *
    `;

    const values = [
      name,
      contact_person,
      phone,
      email,
      address,
      gstin,
      id
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
  },

  async delete(id) {

    const query = `
      DELETE FROM suppliers
      WHERE id=$1
    `;

    await pool.query(query, [id]);

    return true;
  }

};

module.exports = SupplierModel;
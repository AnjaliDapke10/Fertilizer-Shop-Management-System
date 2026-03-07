const pool = require("../config/db");

const UserModel = {

  async findByUsername(username) {

    const res = await pool.query(
      "SELECT * FROM users WHERE username=$1 AND is_active=true",
      [username]
    );

    return res.rows[0];
  },

  async createUser(username, password_hash, role="staff") {

    const res = await pool.query(
      `INSERT INTO users (username,password_hash,role)
       VALUES ($1,$2,$3)
       RETURNING id,username,role`,
      [username, password_hash, role]
    );

    return res.rows[0];
  },
  async updatePassword(id, passwordHash) {

  await pool.query(
    `UPDATE users 
     SET password_hash = $1,
         updated_at = NOW()
     WHERE id = $2`,
    [passwordHash, id]
  );

}

};

module.exports = UserModel;
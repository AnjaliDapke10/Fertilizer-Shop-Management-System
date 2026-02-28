const pool = require("../config/db");

const UserModel = {
  async findByUsername(username) {
    const res = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND is_active = true",
      [username]
    );
    return res.rows[0];
  }
};

module.exports = UserModel;

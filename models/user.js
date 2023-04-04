const { pool } = require("../DB/db");

class User {
  async create({ email, password, role }) {
    const query = `
      INSERT INTO users (email, password, role)
      VALUES (?, ?, ?);
    `;

    await pool.query(query, [email, password, role]);
  }

  async findByEmail(email) {
    const query = `
      SELECT *
      FROM users
      WHERE email = ?
    `;

    const [rows, fields] = await pool.query(query, [email]);
    return rows[0]; // return the first result, or null if not found
  }

  async findById(id) {
    const query = `
      SELECT *
      FROM users
      WHERE id = ?
    `;

    const [rows, fields] = await pool.query(query, [id]);
    return rows[0]; // return the first result, or null if not found
  }
}

module.exports = new User();

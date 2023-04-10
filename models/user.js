const { pool } = require("../DB/db");

class User {
  async create({ name, email, password, address, role }) {
    const query = `
          INSERT INTO users (name, email, password, address, role)
          VALUES (?, ?, ?, ?, ?);
        `;

    await pool.query(query, [name, email, password, address, role]);
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

  async update(id, updatedData) {
    const { name, email, address } = updatedData;
    const query = `
      UPDATE users
      SET name = ?, email = ?, address = ?
      WHERE id = ?;
    `;

    await pool.query(query, [name, email, address, id]);
  }

  async findAll() {
    const query = `
      SELECT id, name, email, address, role
      FROM users
    `;

    const [rows, fields] = await pool.query(query);
    return rows; // return all users
  }
}

module.exports = new User();

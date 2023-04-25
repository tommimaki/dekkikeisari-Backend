const { pool } = require("../DB/db");

class User {
  async create({ name, email, password, address, role }) {
    const query = `
          INSERT INTO users (name, email, password, address, role)
          VALUES (?, ?, ?, ?, ?);
        `;

    // await pool.query(query, [name, email, password, address, role]);
    const [result] = await pool.query(query, [
      name,
      email,
      password,
      address,
      role,
    ]);
    return result.insertId;
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
    const { name, email, address, role } = updatedData;
    const query = `
      UPDATE users
      SET name = ?, email = ?, address = ?, role = ? 
      WHERE id = ?;
    `;

    await pool.query(query, [name, email, address, role, id]);
  }

  async findAll() {
    const query = `
      SELECT id, name, email, address, role
      FROM users
    `;
    const [rows, fields] = await pool.query(query);
    return rows; // return all users
  }

  async delete(id) {
    const query = `
      DELETE FROM users
      WHERE id = ?;
    `;
    await pool.query(query, [id]);
  }

  async deleteAll() {
    const query = `
    DELETE FROM users;
  `;
    await pool.query(query);
  }
}

module.exports = new User();

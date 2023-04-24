// models/newsletterSubscription.js
const { pool } = require("../DB/db");

class newsletterSubscription {
  async create({ email }) {
    const query = `
      INSERT INTO newsletter_subscriptions (email)
      VALUES (?);
    `;

    await pool.query(query, [email]);
  }

  async findAll() {
    const query = `
      SELECT *
      FROM newsletter_subscriptions;
    `;

    const [rows, fields] = await pool.query(query);
    return rows;
  }

  async findByEmail(email) {
    const query = `
      SELECT *
      FROM newsletter_subscriptions
      WHERE email = ?;
    `;

    const [rows, fields] = await pool.query(query, [email]);
    return rows[0];
  }

  async delete(id) {
    const query = `
      DELETE FROM newsletter_subscriptions
      WHERE id = ?;
    `;

    await pool.query(query, [id]);
  }
}

module.exports = {
  newsletterSubscription: new newsletterSubscription(),
};

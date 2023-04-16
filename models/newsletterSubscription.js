const { pool } = require("../DB/db");

class newsletterSubscription {
  async create({ email }) {
    const query = `
      INSERT INTO newsletter_subscriptions (email)
      VALUES (?);
    `;

    await pool.query(query, [email]);
  }
}

module.exports = {
  newsletterSubscription: new newsletterSubscription(),
};

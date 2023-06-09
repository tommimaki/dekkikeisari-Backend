const { pool } = require("../DB/db");

class Wishlist {
  async create(userId, productId) {
    const query = `
          INSERT INTO wishlists (user_id, product_id)
          VALUES (?, ?);
        `;
    await pool.query(query, [userId, productId]);
  }

  async delete(userId, productId) {
    const query = `
      DELETE FROM wishlists
      WHERE user_id = ? AND product_id = ?
    `;

    await pool.query(query, [userId, productId]);
  }

  async findByUserId(userId) {
    const query = `
      SELECT products.*
      FROM wishlists
      JOIN products ON wishlists.product_id = products.id
      WHERE wishlists.user_id = ?
    `;

    const [rows, fields] = await pool.query(query, [userId]);
    return rows;
  }

  async findItem(userId, productId) {
    const query = `
      SELECT * FROM wishlists
      WHERE user_id = ? AND product_id = ?
    `;

    const [rows, fields] = await pool.query(query, [userId, productId]);
    return rows[0];
  }
}

module.exports = new Wishlist();

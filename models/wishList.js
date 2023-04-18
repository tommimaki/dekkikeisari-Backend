const { pool } = require("../DB/db");

class Wishlist {
  async create(userId, productId) {
    const query = `
          INSERT INTO wishlists (user_id, product_id)
          VALUES (?, ?);
        `;

    console.log("Executing query:", query);
    console.log("With parameters:", userId, productId);

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
}

module.exports = new Wishlist();

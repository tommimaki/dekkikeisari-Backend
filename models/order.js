const { pool } = require("../DB/db");

class Order {
  async create({ customerId, products, total, shippingAddress }) {
    const query = `
      INSERT INTO orders (customer_id, products, total, shipping_address)
      VALUES (?, ?, ?, ?);
    `;

    await pool.query(query, [
      customerId,
      JSON.stringify(products),
      total,
      JSON.stringify(shippingAddress),
    ]);
  }

  async find() {
    const query = `
      SELECT *
      FROM orders
    `;

    const [rows, fields] = await pool.query(query);
    return rows;
  }

  async findById(id) {
    const query = `
      SELECT *
      FROM orders
      WHERE id = ?
    `;

    const [rows, fields] = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = new Order();

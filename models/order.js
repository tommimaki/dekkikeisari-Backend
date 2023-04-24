const { pool } = require("../DB/db");

class Order {
  async create({
    customerId,
    products,
    total,
    shippingAddress,
    name,
    email,
    status,
  }) {
    const query = `
      INSERT INTO orders (customer_id, products, total, shipping_address, customer_name, customer_email, status)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const [result] = await pool.query(query, [
      customerId,
      JSON.stringify(products),
      total,
      JSON.stringify(shippingAddress),
      name,
      email,
      status,
    ]);
    const orderId = result.insertId;
    return orderId;
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

  async updateById(id, data) {
    const fields = Object.keys(data)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(data);

    const query = `
      UPDATE orders
      SET ${fields}
      WHERE id = ?
    `;

    await pool.query(query, [...values, id]);
  }

  async deleteById(id) {
    const query = `
      DELETE FROM orders
      WHERE id = ?
    `;

    await pool.query(query, [id]);
  }

  async findByCustomerId(customerId) {
    const query = `
    SELECT *
    FROM orders
    WHERE customer_id = ?
  `;

    const [rows, fields] = await pool.query(query, [customerId]);
    return rows;
  }
}

module.exports = new Order();

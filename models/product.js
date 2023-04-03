const { pool } = require("../DB/db");

class Product {
  async create({ name, description, price, category, image_url, sizes }) {
    const query = `
      INSERT INTO products (name, description, price, category, image_url, sizes)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    await pool.query(query, [
      name,
      description,
      price,
      category,
      image_url,
      sizes,
    ]);
  }

  async find(category = null) {
    let query = `
      SELECT *
      FROM products
    `;

    if (category) {
      query += `WHERE category = '${category}'`;
    }

    const [rows, fields] = await pool.query(query);
    return rows;
  }

  async findById(id) {
    const query = `
      SELECT *
      FROM products
      WHERE id = ?
    `;

    const [rows, fields] = await pool.query(query, [id]);
    return rows[0]; // return the first result, or null if not found
  }
  async delete(id) {
    const query = `
      DELETE FROM products
      WHERE id = ?
    `;

    await pool.query(query, [id]);
  }

  async update(id, { name, description, price, category, image_url, sizes }) {
    const query = `
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, image_url = ?, sizes = ?
      WHERE id = ?;
    `;

    await pool.query(query, [
      name,
      description,
      price,
      category,
      image_url,
      sizes,
      id,
    ]);
  }
}

module.exports = new Product();

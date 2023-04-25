const { pool } = require("../DB/db");

class Product {
  async create({ name, description, price, category, image_urls, sizes }) {
    const query = `
      INSERT INTO products (name, description, price, category, image_urls, sizes)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const [result] = await pool.query(query, [
      name,
      description,
      price,
      category,
      JSON.stringify(image_urls),
      sizes,
    ]);

    return { id: result.insertId };
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
    return rows[0];
  }
  async delete(id) {
    const query = `
      DELETE FROM products
      WHERE id = ?
    `;

    await pool.query(query, [id]);
  }

  async findByProductName(productName) {
    const query = `
      SELECT *
      FROM products
      WHERE name = ?
    `;

    const [rows, fields] = await pool.query(query, [productName]);
    return rows[0];
  }

  async update(id, { name, description, price, category, image_urls, sizes }) {
    const query = `
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, image_urls = ?, sizes = ?
      WHERE id = ?;
    `;

    await pool.query(query, [
      name,
      description,
      price,
      category,
      image_urls,
      sizes,
      id,
    ]);
  }
}

module.exports = new Product();

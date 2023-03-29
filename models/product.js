const db = require("../DB/db");

class Product {
  async create({ name, description, price, category, image_url, sizes }) {
    const query = `
      INSERT INTO products (name, description, price, category, image_url, sizes)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const connection = await db;
    await connection.execute(query, [
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

    const connection = await db;
    const [rows, fields] = await connection.execute(query);
    return rows;
  }

  async findById(id) {
    const query = `
      SELECT *
      FROM products
      WHERE id = ?
    `;

    const connection = await db;
    const [rows, fields] = await connection.execute(query, [id]);
    return rows[0]; // return the first result, or null if not found
  }
}

module.exports = new Product();

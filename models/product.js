const db = require("../DB/db");

class Product {
  async create({ name, description, price, category, image_url }) {
    const query = `
      INSERT INTO products (name, description, price, category, image_url)
      VALUES (?, ?, ?, ?, ?);
    `;

    const connection = await db;
    await connection.execute(query, [
      name,
      description,
      price,
      category,
      image_url,
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
}

module.exports = new Product();

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
}

module.exports = new Product();

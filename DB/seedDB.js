const db = require("./db");

const products = [
  {
    name: "Product 1",
    description: "This is the description of product 1",
    price: 49.99,
    category: "Category 1",
    image_url: "https://example.com/product-1.jpg",
  },
  // Add more product objects
];

const seedProducts = async () => {
  const connection = await db;

  for (const product of products) {
    const query = `
        INSERT INTO products (name, description, price, category, image_url)
        VALUES (?, ?, ?, ?, ?);
      `;

    await connection.execute(query, [
      product.name,
      product.description,
      product.price,
      product.category,
      product.image_url,
    ]);
  }
};

seedProducts()
  .then(() => {
    console.log("Database seeded successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });

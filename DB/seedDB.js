const { pool } = require("./db");

const products = [
  {
    name: "Shirt 1",
    description: "A stylish shirt for everyday wear.",
    price: 29.99,
    category: "Shirts",
    image_urls: ["https://picsum.photos/400", "https://picsum.photos/400"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Shirt 2",
    description: "A comfortable shirt with a modern design.",
    price: 34.99,
    category: "Shirts",
    image_urls: ["https://picsum.photos/400", "https://picsum.photos/400"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Shoe 1",
    description: "A durable shoe with excellent grip.",
    price: 89.99,
    category: "Shoes",
    image_urls: ["https://picsum.photos/400", "https://picsum.photos/400"],
    sizes: [6, 7, 8, 9, 10, 11],
  },
  {
    name: "Shoe 2",
    description: "A comfortable shoe with a modern design.",
    price: 99.99,
    category: "Shoes",
    image_urls: ["https://picsum.photos/400", "https://picsum.photos/400"],
    sizes: [6, 7, 8, 9, 10, 11],
  },
  {
    name: "Deck 1",
    description: "A classic skateboard deck with a minimalist design.",
    price: 49.99,
    category: "Skateboards",
    image_urls: ["https://picsum.photos/400", "https://picsum.photos/400"],
    sizes: ["8.0", "8.25", "8.5"],
  },
  {
    name: "Deck 2",
    description: "A vibrant skateboard deck with a graphic print.",
    price: 54.99,
    category: "Skateboards",
    image_urls: ["https://picsum.photos/400", "https://picsum.photos/400"],
    sizes: ["7.75", "8.0", "8.25", "8.5"],
  },
  {
    name: "Deck 3",
    description: "A durable skateboard deck with a unique shape.",
    price: 59.99,
    category: "Skateboards",
    image_urls: ["https://picsum.photos/400", "https://picsum.photos/400"],
    sizes: ["8.0", "8.25", "8.5", "8.75"],
  },
];

const seedProducts = async () => {
  for (const product of products) {
    const query = `
        INSERT INTO products (name, description, price, category, image_urls, sizes)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

    await pool.execute(query, [
      product.name,
      product.description,
      product.price,
      product.category,
      product.image_urls,
      product.sizes,
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

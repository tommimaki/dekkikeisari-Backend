if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}
//setting the testdb via .env.test
const request = require("supertest");
const app = require("../app");
const Product = require("../models/product");
const { pool } = require("../DB/db");

beforeAll(async () => {
  // Establishing database connection before running tests
  try {
    const conn = await pool.getConnection();
    console.log("Connected to the database!");
    conn.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
});

describe("Product routes", () => {
  it("should add a new product", async () => {
    const response = await request(app)
      .post("/products/add")
      .send({
        name: "Product Name",
        description: "Product Description",
        price: 99.99,
        category: "Some Category",
        sizes: JSON.stringify(["S", "M", "L"]),
        image_urls: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
      })
      .expect(201);

    expect(response.body).toHaveProperty(
      "message",
      "Product added successfully"
    );
  });

  it("should fetch all products", async () => {
    const response = await request(app).get("/products").expect(200);

    expect(response.body).toHaveProperty("products");
    expect(response.body.products).toBeInstanceOf(Array);
  });

  describe("GET /products/:id", () => {
    it("should return a product by ID", async () => {
      const product = {
        name: "Product test Name",
        description: "Product Description",
        price: 99.99,
        category: "Some Category",
        sizes: JSON.stringify(["S", "M", "L"]),
        image_urls: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
      };
      // Inserting the product into the database
      await Product.create(product);
      // Finding the inserted product by name
      const existingProduct = await Product.findByProductName(product.name);
      // Sending a request to get the product by ID
      const res = await request(app).get(`/products/${existingProduct.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("product");
      const receivedProduct = {
        ...res.body.product,
        price: parseFloat(res.body.product.price),
      };
      expect(receivedProduct).toMatchObject(product);
      // Deleting the product from the database
      await Product.delete(existingProduct.id);
    });
    it("should return 404 if product not found", async () => {
      const nonExistentProductId = 999999;
      const res = await request(app).get(`/products/${nonExistentProductId}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("message", "Product not found");
    });
  });
});

afterAll(async () => {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("DELETE FROM products");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");
  await pool.end();
});

const request = require("supertest");
const app = require("../app");
const { pool } = require("../DB/db");

if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}

beforeAll(async () => {
  // Establish database connection before running tests
  try {
    const conn = await pool.getConnection();
    console.log("Connected to the database!");
    conn.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
});

describe("Product routes", () => {
  let productId;

  it("should add a new product", async () => {
    const response = await request(app)
      .post("/products/add")
      .send({
        name: "Product Name",
        description: "Product Description",
        price: 99.99,
        category: "Some Category",
        sizes: ["S", "M", "L"],
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
      })
      .expect(201);

    expect(response.body).toHaveProperty("id");
    productId = response.body.id;
  });
});
afterAll(async () => {
  await pool.end();
});

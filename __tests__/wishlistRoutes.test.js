if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}

const request = require("supertest");
const app = require("../app");
const Wishlist = require("../models/wishList");
const { pool } = require("../DB/db");
const User = require("../models/user");
const Product = require("../models/product");

const nonExistentUserId = 999;
const nonExistentProductId = 999;

describe("Wishlist routes", () => {
  let testUserId;
  let testProductId;

  const testUserData = {
    name: "Test User",
    email: `test.user${Date.now()}@example.com`,
    password: "test_password",
    address: "Test Address",
    role: "customer",
  };

  const testProductData = {
    name: "Product Name",
    description: "Product Description",
    price: 99.99,
    category: "Some Category",
    sizes: JSON.stringify(["S", "M", "L"]),
    image_urls: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
  };
  beforeAll(async () => {
    // Establishing database connection before running tests
    try {
      const conn = await pool.getConnection();
      //   console.log("Connected to the database!");
      conn.release();
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  });

  beforeEach(async () => {
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Clear the database before each test
    await pool.query("DELETE FROM wishlists");
    await pool.query("DELETE FROM users");
    await pool.query("DELETE FROM products");

    const user = await User.create(testUserData);
    const product = await Product.create(testProductData);
    testUserId = user;
    testProductId = product.id;
  });

  afterAll(async () => {
    await pool.query("DELETE FROM wishlists");
    await pool.query("DELETE FROM users");
    await pool.query("DELETE FROM products");
    await pool.query("DELETE FROM orders");
    await pool.query("SET FOREIGN_KEY_CHECKS = 1;");
    await pool.end();
  });

  it("should add a product to the user's wishlist", async () => {
    const response = await request(app).post("/wishlist/add").send({
      user_id: testUserId,
      product_id: testProductId,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Product added to wishlist " + testProductId
    );
  });

  it("should not add a product to the user's wishlist if it already exists", async () => {
    await request(app).post("/wishlist/add").send({
      user_id: testUserId,
      product_id: testProductId,
    });

    const response = await request(app).post("/wishlist/add").send({
      user_id: testUserId,
      product_id: testProductId,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Product already exists in wishlist"
    );
  });

  it("should remove a product from the user's wishlist", async () => {
    await request(app).post("/wishlist/add").send({
      user_id: testUserId,
      product_id: testProductId,
    });

    const response = await request(app).delete("/wishlist/remove").send({
      user_id: testUserId,
      product_id: testProductId,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Product removed from wishlist"
    );
  });
  it("should get the user's wishlist", async () => {
    await request(app).post("/wishlist/add").send({
      user_id: testUserId,
      product_id: testProductId,
    });

    const response = await request(app).get(`/wishlist/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body.wishlist).toEqual(expect.any(Array));
    expect(
      response.body.wishlist.some((item) => item.id === testProductId)
    ).toBe(true);
  });
  it("should return an empty array for a non-existent user's wishlist", async () => {
    const response = await request(app).get(`/wishlist/${nonExistentUserId}`);

    expect(response.status).toBe(200);
    expect(response.body.wishlist).toEqual(expect.any(Array));
    expect(response.body.wishlist.length).toBe(0);
  });
});

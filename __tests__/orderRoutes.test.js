if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}
//setting the testdb via .env.test
const request = require("supertest");
const app = require("../app");
const Order = require("../models/order");
const { pool } = require("../DB/db");
const order = require("../models/order");

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

describe("Order routes", () => {
  beforeEach(async () => {
    await pool.query("DELETE FROM orders");
  });

  afterEach(async () => {
    await pool.query("DELETE FROM orders");
  });

  it("should create a new order", async () => {
    const { customerId, products, total, shippingAddress, name, email } = {
      customerId: 1,
      products: [
        {
          productId: 73,
          price: "39.99",
          quantity: 1,
        },
      ],
      total: 39.99,
      shippingAddress: "Tomminkatu 16",
      name: "John Doe",
      email: "john.doe@example.com",
    };

    const response = await request(app).post("/orders").send({
      customerId,
      products,
      total,
      shippingAddress,
      name,
      email,
    });

    console.log("Response status:", response.status);
    console.log("Response body:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Order created successfully"
    );
    expect(response.body).toHaveProperty("orderId");
    expect(typeof response.body.orderId).toBe("number");
  });

  // Other test cases for Orders:
  // - Fetch all orders
  // - Fetch order by ID
  // - Update order
  // - Delete order
  // - Fetch orders by customer ID
});

afterAll(async () => {
  await pool.end();
});

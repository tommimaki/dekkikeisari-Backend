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
    await pool.query("SET FOREIGN_KEY_CHECKS = 0");
    conn.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
});
afterAll(async () => {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("DELETE FROM orders");
  await pool.query("DELETE FROM products");
  await pool.query("DELETE FROM users");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");
  await pool.end();
});

describe("Order routes", () => {
  let createdOrderId;

  beforeEach(async () => {
    createdOrderId = await order.create({
      customerId: 1,
      products: JSON.stringify([
        { productId: 73, price: "39.99", quantity: 1 },
      ]),
      total: 39.99,
      shippingAddress: JSON.stringify("Tomminkatu 16"),
      name: "John Doe",
      email: "john.doe@example.com",
      status: "pending",
    });
  });

  afterEach(async () => {
    await order.deleteById(createdOrderId);
  });

  //empty the test db after testing
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

  it("should fetch all orders", async () => {
    const response = await request(app).get("/orders");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("orders");
    expect(response.body.orders).toBeInstanceOf(Array);
  });

  it("should fetch an order by ID", async () => {
    const createdOrderId = await order.create({
      customerId: 1,
      products: JSON.stringify([
        { productId: 73, price: "39.99", quantity: 1 },
      ]),
      total: 39.99,
      shippingAddress: JSON.stringify("Tomminkatu 16"),
      name: "John Doe",
      email: "john.doe@example.com",
      status: "pending",
    });

    const response = await request(app).get(`/orders/${createdOrderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("order");
    expect(response.body.order.id).toBe(createdOrderId);
  });

  it("should update an order", async () => {
    const createdOrderId = await order.create({
      customerId: 1,
      products: JSON.stringify([
        { productId: 73, price: "39.99", quantity: 1 },
      ]),
      total: 39.99,
      shippingAddress: JSON.stringify("Tomminkatu 16"),
      name: "John Doe",
      email: "john.doe@example.com",
      status: "pending",
    });

    const updatedData = {
      status: "shipped",
    };

    const response = await request(app)
      .put(`/orders/${createdOrderId}`)
      .send(updatedData);
    console.log("Update order error:", response.body.message);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Order updated successfully"
    );
    expect(response.body).toHaveProperty("order");
    expect(response.body.order.status).toBe(updatedData.status);
  });

  it("should delete an order", async () => {
    const createdOrderId = await order.create({
      customerId: 1,
      products: JSON.stringify([
        { productId: 73, price: "39.99", quantity: 1 },
      ]),
      total: 39.99,
      shippingAddress: JSON.stringify("Tomminkatu 16"),
      name: "John Doe",
      email: "john.doe@example.com",
      status: "pending",
    });

    const response = await request(app).delete(`/orders/${createdOrderId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Order deleted successfully"
    );
  });

  it("should fetch orders by customer ID", async () => {
    const customerId = 1;
    const createdOrderId = await order.create({
      customerId,
      products: JSON.stringify([
        { productId: 73, price: "39.99", quantity: 1 },
      ]),
      total: 39.99,
      shippingAddress: JSON.stringify("Tomminkatu 16"),
      name: "John Doe",
      email: "john.doe@example.com",
      status: "pending",
    });

    const response = await request(app).get(`/orders/customer/${customerId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("orders");
    expect(response.body.orders).toBeInstanceOf(Array);
    expect(response.body.orders[0].customer_id).toBe(customerId);
  });
});

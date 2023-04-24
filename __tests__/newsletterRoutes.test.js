if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}

const Product = require("../models/newsletterSubscription");
const request = require("supertest");
const app = require("../app");
const { pool } = require("../DB/db");

const testSubscriptionEmail = "test.subscription@example.com";

beforeAll(async () => {
  //emptying testdb:
  await pool.query("DELETE FROM newsletter_subscriptions");

  // Establishing database connection before running tests
  try {
    const conn = await pool.getConnection();
    console.log("Connected to the database!");
    conn.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
});

describe("Newsletter routes", () => {
  it("should create a newsletter subscription", async () => {
    const response = await request(app).post("/newsletter/subscribe").send({
      email: testSubscriptionEmail,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Subscribed successfully");
  });

  it("should get all newsletter subscriptions", async () => {
    const response = await request(app).get("/newsletter/subscriptions");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should get a newsletter subscription by email", async () => {
    const response = await request(app).get(
      `/newsletter/subscription/${testSubscriptionEmail}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email", testSubscriptionEmail);
  });

  it("should delete a newsletter subscription by email", async () => {
    const response = await request(app).delete(
      `/newsletter/subscription/${testSubscriptionEmail}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Subscription deleted successfully"
    );
  });
});

afterAll(async () => {
  await pool.end();
});

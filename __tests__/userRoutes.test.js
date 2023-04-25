if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: ".env.test" });
} else {
  require("dotenv").config();
}

const request = require("supertest");
const app = require("../app");
const { pool } = require("../DB/db");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Connected to the database!");
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
    conn.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
});

let testUserId;
beforeEach(async () => {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
  await pool.query("DELETE FROM users");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1;");

  testUser = {
    name: "Test User",
    email: "test.user@example.com",
    password: "test_password",
    address: "Test Address",
    role: "customer",
  };

  testUserId = await User.create(testUser);
  userToken = jwt.sign({ userId: testUserId }, "secret-key");
});

afterAll(async () => {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
  await pool.query("DELETE FROM users");
  await pool.query("DELETE FROM orders");
  await pool.query("DELETE FROM products");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1;");
  await pool.end();
});

describe("User routes", () => {
  it("should create a user", async () => {
    const newUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "john_password",
      address: "John's Address",
      role: "customer",
    };

    const response = await request(app).post("/users/create").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User created successfully"
    );
  });

  it("should get user data", async () => {
    const response = await request(app)
      .get("/users/user")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
    expect(response.body).toHaveProperty("email", testUser.email);
    expect(response.body).toHaveProperty("name", testUser.name);
    expect(response.body).toHaveProperty("address", testUser.address);
    expect(response.body).toHaveProperty("role", testUser.role);
  });

  it("should update user data", async () => {
    const updatedData = {
      name: "Updated Test User",
      email: "updated.test.user@example.com",
      address: "Updated Test Address",
      role: "customer",
    };

    const response = await request(app)
      .put("/users/user")
      .set("Authorization", `Bearer ${userToken}`)
      .send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
    expect(response.body).toHaveProperty("email", updatedData.email);
    expect(response.body).toHaveProperty("name", updatedData.name);
    expect(response.body).toHaveProperty("address", updatedData.address);
    expect(response.body).toHaveProperty("role", updatedData.role);
  });
});

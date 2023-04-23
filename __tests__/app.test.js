const request = require("supertest");
const app = require("../app"); // Replace with the correct path to your app file

const { pool } = require("../DB/db");

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

afterAll(async () => {
  // Close database connection after all tests are done
  try {
    await pool.end();
    console.log("Connection closed!");
  } catch (err) {
    console.error("Error closing the database connection:", err);
  }
});

describe("Test Suite", () => {
  test("Test case", () => {
    // Test code goes here
  });
});

describe("App tests", () => {
  it("GET / should return a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain(
      "Backend for a portfolio project for a skateboarding online store"
    );
  });

  // Add more tests for other routes and their expected behavior
  // For example, you can test the response status codes, response body structure, and content
});

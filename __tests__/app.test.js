const request = require("supertest");
const app = require("../app");

const { pool } = require("../DB/db");

beforeAll(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Connected to the database!");
    conn.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
});

afterAll(async () => {
  try {
    await pool.end();
    console.log("Connection closed!");
  } catch (err) {
    console.error("Error closing the database connection:", err);
  }
});

describe("App tests", () => {
  it("GET / should return a welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain(
      "Backend for a portfolio project for a skateboarding online store"
    );
  });
});

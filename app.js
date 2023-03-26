// app.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

db.query("SELECT 1 + 1 AS solution", (err, results) => {
  if (err) {
    console.error("Error executing query:", err.stack);
  } else {
    console.log("Query result:", results[0].solution);
  }
});

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

module.exports = app;

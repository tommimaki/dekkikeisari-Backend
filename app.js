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

// db.query(
//   `CREATE TABLE users (
//       id INT PRIMARY KEY AUTO_INCREMENT,
//       name VARCHAR(255),
//       email VARCHAR(255)
//     )`,
//   (err, results) => {
//     if (err) {
//       console.error("Error creating table:", err.stack);
//     } else {
//       console.log("Table created successfully");
//     }
//   }
// );

// db.query(
//   "INSERT INTO users (name, email) VALUES ('John Doe', 'johndoe@example.com')",
//   (err, results) => {
//     if (err) {
//       console.error("Error inserting user:", err.stack);
//     } else {
//       console.log("User inserted successfully");
//     }
//   }
// );

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

module.exports = app;

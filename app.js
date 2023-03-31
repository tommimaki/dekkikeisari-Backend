const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./DB/db");
const productRoute = require("./routes/productRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});
app.get("/testdb", async (req, res) => {
  try {
    const db = require("./DB/db");
    const [rows] = await db.query("SELECT 1+1 AS solution");
    res.status(200).json({ message: "DB Connection successful!", data: rows });
  } catch (error) {
    res.status(500).json({ message: "DB Connection failed!", error });
  }
});

// Pass the upload instance to the productRoute
app.use("/products", productRoute);

module.exports = app;

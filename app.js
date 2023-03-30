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

// Pass the upload instance to the productRoute
app.use("/products", productRoute);

module.exports = app;

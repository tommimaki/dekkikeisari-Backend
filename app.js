// app.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./DB/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

module.exports = app;

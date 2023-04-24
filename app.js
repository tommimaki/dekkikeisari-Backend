const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
//routes
const productRoute = require("./routes/productRoutes");
const orderRoute = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const wishListRoutes = require("./routes/wishListRoutes");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend for a portfolio project for a skateboarding online store");
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // limiting each IP to 2000 requests per 15 min// dont overload my aws LOL
  message: "Too many requests from this IP, please try again later",
});

app.use(limiter);
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/wishlist", wishListRoutes);

module.exports = app;

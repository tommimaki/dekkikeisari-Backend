const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
} = require("../controllers/productController");
// const productController = require("../controllers/productController");

// ADD PRODUCTS
router.post("/add", addProduct);
router.get("/", getAllProducts);

module.exports = router;

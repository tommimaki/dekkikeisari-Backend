const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
// const productController = require("../controllers/productController");

// ADD PRODUCTS
router.post("/add", addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;

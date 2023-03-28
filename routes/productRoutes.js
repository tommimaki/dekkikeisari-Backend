const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// ADD PRODUCTS
router.post("/add", productController.addProduct);

module.exports = router;

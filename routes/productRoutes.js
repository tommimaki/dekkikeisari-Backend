const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../uploadConfig");

const {
  addProduct,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
// const productController = require("../controllers/productController");

// ADD PRODUCTS
// router.post("/add", addProduct);
router.post("/add", upload.single("image"), addProduct);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;

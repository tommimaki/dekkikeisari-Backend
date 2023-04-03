const express = require("express");
const router = express.Router();
const { upload, processImage } = require("../uploadConfig");

const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

router.post("/add", upload.single("image"), processImage, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/:id", upload.single("image"), processImage, updateProduct);

module.exports = router;

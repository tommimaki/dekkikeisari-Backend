const express = require("express");
const router = express.Router();
const { upload, processImages } = require("../uploadConfig");

const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// router.post("/add", upload.single("image"), processImages, addProduct);
// router.post("/add", upload.array("image"), processImages, addProduct);
router.post("/add", upload.array("images[]"), processImages, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
// router.put("/:id", upload.single("image"), processImage, updateProduct);

module.exports = router;

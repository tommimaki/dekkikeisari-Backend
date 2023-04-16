const express = require("express");
const router = express.Router();
const { upload, processImages } = require("../uploadConfig");
const { authenticateAdmin } = require("../middleware/authenticate");

const {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductByName,
} = require("../controllers/productController");

router.post("/add", upload.array("images[]"), processImages, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/:productName", getProductByName);
router.delete("/:id", deleteProduct);
router.put(
  "/:id",
  authenticateAdmin,
  upload.array("images[]"),
  processImages,
  updateProduct
);

module.exports = router;

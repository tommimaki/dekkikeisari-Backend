const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} = require("../controllers/wishlistController");

router.post("/add", addToWishlist);
router.delete("/remove/:id", removeFromWishlist);
router.get("/", getUserWishlist);

module.exports = router;

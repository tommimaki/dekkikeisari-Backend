const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
} = require("../controllers/wishListController");

router.post("/add", addToWishlist);
router.delete("/remove", removeFromWishlist);
router.get("/:userId", getUserWishlist);

module.exports = router;

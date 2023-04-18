const Wishlist = require("../models/wishlist");
const logger = require("../utils/logger");

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const uId = req.body.user_id;
    const pId = req.body.product_id;
    console.log(pId, "body");
    console.log(uId, "usid");
    await Wishlist.create(uId, pId);
    res.status(201).json({ message: "Product added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product to wishlist" });
    logger.error(error);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    await Wishlist.delete(userId, productId);
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product from wishlist" });
  }
};

const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findByUserId(userId);
    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user wishlist" });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};

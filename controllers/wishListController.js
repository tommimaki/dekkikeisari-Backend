const Wishlist = require("../models/wishList");
const logger = require("../utils/logger");

const addToWishlist = async (req, res) => {
  try {
    const uId = req.body.user_id;
    const pId = req.body.product_id;
    const existingItem = await Wishlist.findItem(uId, pId);
    if (existingItem) {
      res.status(400).json({ message: "Product already exists in wishlist" });
      return;
    }

    console.log("in usercontroller pId and uId, ", uId, pId);
    await Wishlist.create(uId, pId);
    res.status(201).json({ message: "Product added to wishlist " + pId });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product to wishlist" });
    logger.error(error);
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    logger.info("removing: ", req.body);
    await Wishlist.delete(userId, productId);
    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product from wishlist" });
  }
};

const getUserWishlist = async (req, res) => {
  logger.info("fetching user wishlist");
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findByUserId(userId);
    logger.info(`wishlist fetched correctly for customer with ID: ${userId}`);
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

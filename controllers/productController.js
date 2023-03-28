const Product = require("../models/product");
const logger = require("../utils/logger");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image_url } = req.body;

    if (!name || !description || !price || !category || !image_url) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Product.create({ name, description, price, category, image_url });

    logger.info("Product added succesfully");
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    logger.error(`Error adding product: ${error}`);
    res.status(500).json({ message: "Failed to add product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const products = await Product.find(category);
    logger.info("Products fetched correctly");
    res.status(200).json({ products });
  } catch (error) {
    logger.error(`Error getting products: ${error}`);
    res.status(500).json({ message: "Failed to get products" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
};

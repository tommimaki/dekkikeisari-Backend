const Product = require("../models/product");
const logger = require("../utils/logger");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image_url, sizes } = req.body;

    if (!name || !description || !price || !category || !image_url || !sizes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Product.create({
      name,
      description,
      price,
      category,
      image_url,
      sizes,
    });

    logger.info("Product added successfully");
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

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      logger.error(`Product not found with id: ${id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    logger.info(`Product fetched successfully with id: ${id}`);
    res.status(200).json({ product });
  } catch (error) {
    logger.error(`Error getting product by id: ${error}`);
    res.status(500).json({ message: "Failed to get product" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
};

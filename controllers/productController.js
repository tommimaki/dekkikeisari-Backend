const Product = require("../models/product");
const logger = require("../utils/logger");
const AWS = require("aws-sdk");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes } = req.body;

    if (!name || !description || !price || !category || !sizes || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fileName = `products/${Date.now()}-${generateFileName()}-${
      req.file.originalname
    }`;
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Body: req.file.buffer,
      Key: fileName,
      ContentType: req.file.mimetype,
      // ACL: "public-read",
    };

    await s3.send(new PutObjectCommand(uploadParams));
    const image_url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

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
    logger.info(`Product: ${product.sizes}`);

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

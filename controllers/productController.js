const Product = require("../models/product");
const logger = require("../utils/logger");
const AWS = require("aws-sdk");
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
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

const getProductByName = async (req, res) => {
  try {
    const { productName } = req.params;
    const product = await Product.findByProductName(productName);

    if (!product) {
      logger.error(`Product not found with name: ${productName}`);
      return res.status(404).json({ message: "Product not found" });
    }

    logger.info(`Product fetched successfully with name: ${productName}`);
    res.status(200).json({ product });
  } catch (error) {
    logger.error(`Error getting product by name: ${error}`);
    res.status(500).json({ message: "Failed to get product" });
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

//delete
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      logger.error(`Product not found with id: ${id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    // Checking if the image URLs are in S3 bucket, if so deletes them with the product
    const imageUrls = product.image_urls || [];

    for (const imageUrl of imageUrls) {
      if (
        imageUrl.includes(
          `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
        )
      ) {
        const imageKey = imageUrl.split(
          `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
        )[1];

        if (imageKey) {
          const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: imageKey,
          };

          await s3.send(new DeleteObjectCommand(deleteParams));
        }
      }
    }

    // Remove the product from the database
    await Product.delete(id);
    logger.info(`Product deleted successfully with id: ${id}`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting product: ${error}`);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

///ADD products
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes } = req.body;

    if (!name || !description || !price || !category || !sizes) {
      return res.status(400).json({ message: "Reuired fields are missing" });
    }

    //image handeling
    const imageUrls = [];
    for (const file of req.files) {
      const fileName = `products/${Date.now()}-${generateFileName()}-${
        file.originalname
      }`;
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Body: file.buffer,
        Key: fileName,
        ContentType: file.mimetype,
      };

      //sends the image to s3 bucket, takes the urls and pushes it to an array that we then pass for the object
      await s3.send(new PutObjectCommand(uploadParams));
      const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      imageUrls.push(imageUrl);
    }

    await Product.create({
      name,
      description,
      price,
      category,
      image_urls: JSON.stringify(imageUrls),
      sizes,
    });

    logger.info("Product added successfully");
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    logger.error(`Error adding product: ${error}`);
    res.status(500).json({ message: "Failed to add product" });
  }
};

//Update
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, sizes } = req.body;

    if (!name || !description || !price || !category || !sizes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(id);
    console.log("req files:", req.files);

    if (!product) {
      logger.error(`Product not found with id: ${id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrls = product.image_urls;
    console.log("Initial imageUrls:", imageUrls);

    if (Array.isArray(req.files) && req.files.length > 0) {
      // Deleting old images from S3 bucket
      if (Array.isArray(imageUrls)) {
        console.log("Deleting old images from S3 bucket...");
        for (const oldImageUrl of imageUrls) {
          if (
            oldImageUrl.includes(
              `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
            )
          ) {
            const imageKey = oldImageUrl.split(
              `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
            )[1];

            if (imageKey) {
              const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: imageKey,
              };

              await s3.send(new DeleteObjectCommand(deleteParams));
              console.log(`Deleted image with key '${imageKey}'`);
            }
          }
        }
      }

      // Upload new images to S3 bucket
      const newImageUrls = [];
      for (const file of req.files) {
        const fileName = `products/${Date.now()}-${generateFileName()}-${
          file.originalname
        }`;
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Body: file.buffer,
          Key: fileName,
          ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));
        console.log(`Uploaded file with name '${fileName}'`);

        const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        newImageUrls.push(imageUrl);
      }
      imageUrls = newImageUrls;
      console.log("Updated imageUrls:", imageUrls);
    }

    //for new
    const stringifyWithEscapedQuotes = (arr) => {
      return JSON.stringify(JSON.stringify(arr));
    };

    //Takes old picture urls and forms correctly
    const convertArrayToStringWithEscapedQuotes = (input) => {
      if (Array.isArray(input)) {
        return JSON.stringify(input);
      } else if (typeof input === "string") {
        const desiredFormatRegex = /^\["(.*)"\]$/;
        if (input.match(desiredFormatRegex)) {
          return input;
        } else {
          console.error("Invalid input format");
        }
      } else if (typeof input === "object") {
        return JSON.stringify(Object.values(input));
      } else {
        console.error("Invalid input type");
      }
    };

    const updateData = {
      name,
      description,
      price,
      category,
      sizes,
      image_urls:
        Array.isArray(req.files) && req.files.length > 0
          ? stringifyWithEscapedQuotes(imageUrls)
          : convertArrayToStringWithEscapedQuotes(product.image_urls),
    };
    await Product.update(id, updateData);
    logger.info(`Product updated successfully with id: ${id}`);
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    logger.error(`Error updating product: ${error}`);
    res.status(500).json({ message: "Failed to update product" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  getProductByName,
  deleteProduct,
  updateProduct,
};

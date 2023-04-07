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

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes } = req.body;

    if (!name || !description || !price || !category || !sizes || !req.files) {
      return res.status(400).json({ message: "All fields are required" });
    }

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
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      logger.error(`Product not found with id: ${id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the image URL is from your S3 bucket
    if (
      product.image_url.includes(
        `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
      )
    ) {
      const imageKey = product.image_url.split(
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

    // Remove the product from the database
    await Product.delete(id);

    logger.info(`Product deleted successfully with id: ${id}`);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting product: ${error}`);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

///Todo edit for multiple photos

// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, category, sizes } = req.body;

//     if (!name || !description || !price || !category || !sizes) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const product = await Product.findById(id);

//     if (!product) {
//       logger.error(`Product not found with id: ${id}`);
//       return res.status(404).json({ message: "Product not found" });
//     }

//     let image_urls = product.image_urls;

//     if (req.file) {
//       // Delete old image from S3 bucket
//       if (
//         product.image_urls.includes(
//           `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
//         )
//       ) {
//         const imageKey = product.image_urls.split(
//           `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`
//         )[1];

//         if (imageKey) {
//           const deleteParams = {
//             Bucket: process.env.AWS_S3_BUCKET_NAME,
//             Key: imageKey,
//           };

//           await s3.send(new DeleteObjectCommand(deleteParams));
//         }
//       }

//       // Upload new image to S3 bucket
//       const fileName = `products/${Date.now()}-${generateFileName()}-${
//         req.file.originalname
//       }`;
//       const uploadParams = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Body: req.file.buffer,
//         Key: fileName,
//         ContentType: req.file.mimetype,
//         // ACL: "public-read",
//       };

//       await s3.send(new PutObjectCommand(uploadParams));
//       image_url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
//     }

//     await Product.update(id, {
//       name,
//       description,
//       price,
//       category,
//       image_url,
//       sizes,
//     });

//     logger.info(`Product updated successfully with id: ${id}`);
//     res.status(200).json({ message: "Product updated successfully" });
//   } catch (error) {
//     logger.error(`Error updating product: ${error}`);
//     res.status(500).json({ message: "Failed to update product" });
//   }
// };
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, sizes } = req.body;

    if (!name || !description || !price || !category || !sizes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      logger.error(`Product not found with id: ${id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrls = JSON.parse(product.image_urls);

    if (req.files) {
      // Delete old images from S3 bucket
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
          }
        }
      }

      // Upload new images to S3 bucket
      imageUrls = [];
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
        const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
        imageUrls.push(imageUrl);
      }
    }

    await Product.update(id, {
      name,
      description,
      price,
      category,
      image_urls: JSON.stringify(imageUrls),
      sizes,
    });

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
  deleteProduct,
  updateProduct,
};

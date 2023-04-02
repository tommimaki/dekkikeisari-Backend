// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const AWS = require("aws-sdk");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// require("dotenv").config();

// // Configure the AWS SDK with your credentials
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// // const s3 = new AWS.S3();

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
//   region: process.env.AWS_REGION,
// });

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_S3_BUCKET_NAME,
//     acl: "public-read",
//     key: function (req, file, cb) {
//       cb(null, `products/${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

// module.exports = upload;

// const multer = require("multer");
// const sharp = require("sharp");
// const AWS = require("aws-sdk");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const crypto = require("crypto");
// require("dotenv").config();

// // Configure the AWS SDK with your credentials
// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
//   region: process.env.AWS_REGION,
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const generateFileName = (bytes = 32) =>
//   crypto.randomBytes(bytes).toString("hex");

// app.post("/posts", upload.single("image"), async (req, res) => {
//   const file = req.file;
//   const caption = req.body.caption;

//   const fileBuffer = await sharp(file.buffer)
//     .resize({ height: 1920, width: 1080, fit: "contain" })
//     .toBuffer();

//   const fileName = `products/${Date.now()}-${generateFileName()}-${
//     file.originalname
//   }`;
//   const uploadParams = {
//     Bucket: process.env.AWS_S3_BUCKET_NAME,
//     Body: fileBuffer,
//     Key: fileName,
//     ContentType: file.mimetype,
//     ACL: "public-read",
//   };

//   await s3.send(new PutObjectCommand(uploadParams));

//   // Save the image name to the database. Any other req.body data can be saved here too but we don't need any other image data.
//   // Replace the following line with your own code to save the image name and caption to your database.
//   const post = await yourDatabaseFunction({ imageName: fileName, caption });

//   res.send(post);
// });

const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const fileBuffer = await sharp(req.file.buffer)
      .resize({ height: 1920, width: 1080, fit: "contain" })
      .toBuffer();

    req.file.buffer = fileBuffer;
    next();
  } catch (err) {
    res.status(500).json({ message: "Error processing image" });
  }
};

module.exports = { upload, processImage };

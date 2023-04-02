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

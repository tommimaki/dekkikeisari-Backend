const multer = require("multer");
const sharp = require("sharp");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const processImages = async (req, res, next) => {
  if (!req.files) return next();

  try {
    const processedFiles = await Promise.all(
      req.files.map(async (file) => {
        const fileBuffer = await sharp(file.buffer)
          .resize({ height: 1920, width: 1080, fit: "inside" })
          .toBuffer();
        file.buffer = fileBuffer;
        return file;
      })
    );

    req.files = processedFiles;
    next();
  } catch (err) {
    res.status(500).json({ message: "Error processing images" });
  }
};

module.exports = { upload, processImages };

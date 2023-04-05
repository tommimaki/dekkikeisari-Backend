// const multer = require("multer");
// const sharp = require("sharp");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const processImage = async (req, res, next) => {
//   if (!req.file) return next();

//   try {
//     const fileBuffer = await sharp(req.file.buffer)
//       .resize({ height: 1920, width: 1080, fit: "contain" })
//       .toBuffer();

//     req.file.buffer = fileBuffer;
//     next();
//   } catch (err) {
//     res.status(500).json({ message: "Error processing image" });
//   }
// };

// module.exports = { upload, processImage };

// const multer = require("multer");
// const sharp = require("sharp");

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const processImages = async (req, res, next) => {
//   if (!req.files) return next();

//   try {
//     const processedFiles = await Promise.all(
//       req.files.map(async (file) => {
//         const fileBuffer = await sharp(file.buffer)
//           .resize({ height: 1920, width: 1080, fit: "contain" })
//           .toBuffer();
//         return { ...file, buffer: fileBuffer };
//       })
//     );

//     req.files = processedFiles;
//     next();
//   } catch (err) {
//     res.status(500).json({ message: "Error processing images" });
//   }
// };

// module.exports = { upload, processImages };

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
          .resize({ height: 1920, width: 1080, fit: "contain" })
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

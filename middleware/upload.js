const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");

    return {
      folder: "complaints",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "mp4",
        "mov",
        "avi",
        "webm",
        "mkv",
      ],
    };
  },
});

module.exports = multer({ storage });
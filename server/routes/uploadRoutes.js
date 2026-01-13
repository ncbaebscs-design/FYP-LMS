const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'lms',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'pdf'],
    };
  },
});

const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({
      message: 'File uploaded successfully',
      filePath: req.file.path,
    });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

module.exports = router;

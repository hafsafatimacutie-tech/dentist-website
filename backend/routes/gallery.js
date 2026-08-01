const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const GalleryImage = require('../models/GalleryImage');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  }
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
    }
    cb(null, true);
  }
});

// Public: list all images (optionally filtered by section)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.section ? { section: req.query.section } : {};
    const images = await GalleryImage.find(filter).sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    if (err.name === 'MongooseError' || err.message?.includes('connected')) {
      return res.json([]);
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: upload a new image
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    const image = await GalleryImage.create({
      filename: req.file.filename,
      caption: req.body.caption || '',
      section: req.body.section || 'gallery'
    });
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ message: 'Upload failed', error: err.message });
  }
});

// Admin: delete an image
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const filePath = path.join(UPLOAD_DIR, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const GalleryImage = require('../models/GalleryImage');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// Use memory storage - file stays as a buffer, never touches the server's disk.
// This is what makes uploads persist across Render redeploys (unlike before,
// where files were saved to Render's ephemeral local disk and wiped on every deploy).
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
    }
    cb(null, true);
  }
});

function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'smilefit-dental-studio' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// Public: list all images (optionally filtered by section)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.section ? { section: req.query.section } : {};
    const images = await GalleryImage.find(filter).sort({ uploadedAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: upload a new image
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);

    const image = await GalleryImage.create({
      url: result.secure_url,
      publicId: result.public_id,
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

    // Only attempt Cloudinary cleanup if this image actually has a publicId
    // (older records from before the Cloudinary migration won't have one -
    // their underlying file is already gone from Render's disk anyway, so
    // there's nothing to clean up there, just delete the DB record).
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }
    await GalleryImage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

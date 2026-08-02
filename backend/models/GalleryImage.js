const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  caption: { type: String, default: '' },
  section: {
    type: String,
    enum: ['hero', 'gallery', 'about'],
    default: 'gallery'
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);

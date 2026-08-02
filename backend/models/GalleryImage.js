const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true }, // Cloudinary's ID, needed to delete the image later
  caption: { type: String, default: '' },
  section: {
    type: String,
    enum: ['hero', 'gallery', 'about'],
    default: 'gallery'
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);

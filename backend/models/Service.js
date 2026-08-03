const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true, default: 'General Dentistry' },
  price: { type: Number },
  durationMinutes: { type: Number, default: 30 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

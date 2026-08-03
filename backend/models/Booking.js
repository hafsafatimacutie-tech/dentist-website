const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: false, default: '' },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  time: { type: String, required: true }, // HH:mm
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: { type: String }
}, { timestamps: true });

// Prevent double-booking the same date/time slot when it's still active
bookingSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

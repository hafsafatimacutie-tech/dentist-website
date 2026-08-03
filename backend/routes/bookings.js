const express = require('express');
const Booking = require('../models/Booking');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// Public: create a booking request
router.post('/', async (req, res) => {
  try {
    const { patientName, phone, email, service, date, time } = req.body;
    if (!patientName || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Prevent double-booking the same slot (only counts active bookings)
    const conflict = await Booking.findOne({
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });
    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already booked. Please choose another.' });
    }

    const booking = await Booking.create({ patientName, phone, email, service, date, time });
    res.status(201).json({ message: 'Booking request received', booking });
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Public: get already-taken slots for a given date (so the frontend can grey them out)
router.get('/taken-slots/:date', async (req, res) => {
  try {
    const bookings = await Booking.find({
      date: req.params.date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('time -_id');
    res.json(bookings.map(b => b.time));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: list all bookings
router.get('/', requireAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('service', 'name price durationMinutes')
      .sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: update booking status (confirm/reject/complete/cancel)
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

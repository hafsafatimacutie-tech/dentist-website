const express = require('express');
const Service = require('../models/Service');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// Public: list all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ createdAt: 1 });
    res.json(services);
  } catch (err) {
    if (err.name === 'MongooseError' || err.message?.includes('connected')) {
      return res.json([]);
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: create a service
router.post('/', requireAdmin, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Admin: update a service
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// Admin: delete (deactivate) a service
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

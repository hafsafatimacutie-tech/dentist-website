const express = require('express');
const SiteContent = require('../models/SiteContent');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await SiteContent.find({});
    const payload = Object.fromEntries(items.map((item) => [item.section, item]));
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:section', requireAdmin, async (req, res) => {
  try {
    const updated = await SiteContent.findOneAndUpdate(
      { section: req.params.section },
      { section: req.params.section, ...req.body },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

module.exports = router;

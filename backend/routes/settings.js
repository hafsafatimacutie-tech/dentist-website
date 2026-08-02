const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// There's only ever one settings document. This helper fetches it,
// creating it with defaults on first use if it doesn't exist yet.
async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

// Public: get current site settings
router.get('/', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: update site settings
router.put('/', requireAdmin, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const { clinicName, address, phone, email, hours } = req.body;
    if (clinicName !== undefined) settings.clinicName = clinicName;
    if (address !== undefined) settings.address = address;
    if (phone !== undefined) settings.phone = phone;
    if (email !== undefined) settings.email = email;
    if (hours !== undefined) settings.hours = hours;
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

module.exports = router;

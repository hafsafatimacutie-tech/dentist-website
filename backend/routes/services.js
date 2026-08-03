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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin: one-time bulk import of the standard treatment list (safe to call multiple times, skips duplicates)
router.post('/bulk-import', requireAdmin, async (req, res) => {
  const treatments = [
    // General Dentistry
    { name: 'Consultation + X-Ray', category: 'General Dentistry' },
    { name: 'Scaling', category: 'General Dentistry' },
    { name: 'Scaling + Polishing', category: 'General Dentistry' },
    { name: 'Deep Scaling', category: 'General Dentistry' },
    { name: 'GIC Filling', category: 'General Dentistry' },
    { name: 'Composite Filling', category: 'General Dentistry' },
    { name: 'Extraction', category: 'General Dentistry' },
    { name: 'Surgical Extraction', category: 'General Dentistry' },
    { name: 'Tooth Whitening', category: 'General Dentistry' },
    { name: 'Smile Design', category: 'General Dentistry' },
    { name: 'Veneers', category: 'General Dentistry' },
    { name: 'Tooth Jewellery', category: 'General Dentistry' },
    // RCT & Crowns
    { name: 'Single Sitting RCT (Front)', category: 'RCT & Crowns' },
    { name: 'Single Sitting RCT (Back)', category: 'RCT & Crowns' },
    { name: 'Conventional RCT (Front)', category: 'RCT & Crowns' },
    { name: 'Conventional RCT (Back)', category: 'RCT & Crowns' },
    { name: 'RCT + Crown Package', category: 'RCT & Crowns' },
    { name: 'Ceramic Crown', category: 'RCT & Crowns' },
    { name: 'Zirconia Crown', category: 'RCT & Crowns' },
    { name: 'Fixed Dental Bridge (FPD)', category: 'RCT & Crowns' },
    // Oral Surgery & Flap Surgery
    { name: 'Flap Surgery (Per Quadrant)', category: 'Oral Surgery & Flap Surgery' },
    { name: 'Wisdom Tooth Extraction', category: 'Oral Surgery & Flap Surgery' },
    { name: 'Frenectomy', category: 'Oral Surgery & Flap Surgery' },
    { name: 'Bone Grafting (Per Unit)', category: 'Oral Surgery & Flap Surgery' },
    { name: 'Sinus Lift', category: 'Oral Surgery & Flap Surgery' },
    { name: 'Mouth Ulcer Laser Treatment', category: 'Oral Surgery & Flap Surgery' },
    // Dental Implants
    { name: 'Single Implant Surgery', category: 'Dental Implants' },
    { name: 'Implant Crown', category: 'Dental Implants' },
    { name: 'Immediate Implant', category: 'Dental Implants' },
    { name: 'Immediate Implant + Crown', category: 'Dental Implants' },
    { name: 'All-on-4 Full Arch Rehabilitation', category: 'Dental Implants' },
    { name: 'All-on-6 Full Arch Rehabilitation', category: 'Dental Implants' },
    // Braces & Aligners
    { name: 'Metal Braces', category: 'Braces & Aligners (Orthodontics)' },
    { name: 'Ceramic Braces', category: 'Braces & Aligners (Orthodontics)' },
    { name: 'Self-Ligating Braces', category: 'Braces & Aligners (Orthodontics)' },
    { name: 'Monthly Adjustment Visit', category: 'Braces & Aligners (Orthodontics)' },
    { name: 'Clear Aligners (Mild Case)', category: 'Braces & Aligners (Orthodontics)' },
    { name: 'Clear Aligners (Moderate Case)', category: 'Braces & Aligners (Orthodontics)' },
    { name: 'Clear Aligners (Complex Case)', category: 'Braces & Aligners (Orthodontics)' },
    // Facial Aesthetics & Wellness
    { name: 'Basic Facial', category: 'Facial Aesthetics & Wellness' },
    { name: 'Premium Facial', category: 'Facial Aesthetics & Wellness' },
    { name: 'Dry Cupping', category: 'Facial Aesthetics & Wellness' },
    { name: 'Wet Cupping', category: 'Facial Aesthetics & Wellness' },
    { name: 'Wet Cupping + Massage', category: 'Facial Aesthetics & Wellness' },
    // Pediatric Dentistry
    { name: 'Pulp Therapy / Pulpectomy', category: 'Pediatric Dentistry' },
    { name: 'Pediatric Crown', category: 'Pediatric Dentistry' },
    { name: 'Space Maintainer', category: 'Pediatric Dentistry' },
  ];

  try {
    const existing = await Service.find({}, 'name');
    const existingNames = new Set(existing.map((s) => s.name));
    const toInsert = treatments.filter((t) => !existingNames.has(t.name));
    if (toInsert.length > 0) {
      await Service.insertMany(toInsert);
    }
    res.json({ message: `Imported ${toInsert.length} new treatments (${treatments.length - toInsert.length} already existed and were skipped).` });
  } catch (err) {
    res.status(500).json({ message: 'Import failed', error: err.message });
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


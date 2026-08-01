const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// One-time setup route to create the first admin account.
// Protected by ADMIN_SETUP_KEY from .env so randoms can't create admins.
// Delete or disable this route after you've created your admin account.
router.post('/setup', async (req, res) => {
  try {
    const { username, password, setupKey } = req.body;
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: 'Invalid setup key' });
    }
    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, passwordHash });
    res.status(201).json({ message: 'Admin created', id: admin._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/change-credentials', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }
    if (!newUsername && !newPassword) {
      return res.status(400).json({ message: 'Provide a new username or password' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const match = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    if (newUsername && newUsername.trim()) {
      const normalizedUsername = newUsername.trim();
      const existing = await Admin.findOne({ username: normalizedUsername });
      if (existing && existing._id.toString() !== admin._id.toString()) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      admin.username = normalizedUsername;
    }

    if (newPassword) {
      admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();
    res.json({ message: 'Admin credentials updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

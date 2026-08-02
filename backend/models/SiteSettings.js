const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  clinicName: { type: String, default: 'SmileFit Dental Studio' },
  address: { type: String, default: '123 Clinic Road, Hyderabad, Telangana' },
  phone: { type: String, default: '+91 90000 00000' },
  email: { type: String, default: 'hello@smilefit.example' },
  hours: { type: String, default: 'Mon–Sat, 9:00 AM – 5:00 PM' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

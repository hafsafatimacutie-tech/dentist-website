const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  body: { type: String, default: '' },
  contactText: { type: String, default: '' },
  rightsText: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);

const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  clinicName: { type: String, default: 'SmileFit Dental Studio' },
  address: { type: String, default: '123 Clinic Road, Hyderabad, Telangana' },
  phone: { type: String, default: '+91 90000 00000' },
  email: { type: String, default: 'hello@smilefit.example' },
  hours: { type: String, default: 'Mon–Sat, 9:00 AM – 5:00 PM' },
  aboutText: {
    type: String,
    default: 'SmileFit Dental Studio was founded on a simple idea: dental visits shouldn\'t feel clinical, rushed, or intimidating. Our team takes the time to explain every step of your treatment, so you always know what\'s happening and why.'
  },
  heroTag: { type: String, default: '✦ Newly opened in Hyderabad — now welcoming patients' },
  heroHeadline: { type: String, default: 'A brand-new clinic, built around your comfort from day one.' },
  heroSubtext: { type: String, default: 'We just opened our doors — modern equipment, a calm space, and a team that takes the time to explain every step. Be one of our first patients.' },
  whyChooseUsEyebrow: { type: String, default: 'Why patients choose us' },
  whyChooseUsHeading: { type: String, default: 'Care built around your schedule' },
  whyChooseUsItems: {
    type: [{ title: String, description: String }],
    default: [
      { title: 'Instant Booking', description: 'Pick a service, pick a slot, done — no back-and-forth calls to find a time that works.' },
      { title: 'Transparent Pricing', description: "Every treatment is listed with clear pricing upfront, so there's never a surprise at checkout." },
      { title: 'Gentle, Modern Care', description: 'Modern equipment and a calm, judgment-free environment — especially for anxious first visits.' },
    ],
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);

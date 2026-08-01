const mongoose = require('mongoose');

function isPlaceholderMongoUri(uri) {
  if (!uri) return true;

  const normalized = uri.trim().toLowerCase();
  const placeholderPatterns = [
    /<[^>]+>/,
    /your-username/,
    /your-password/,
    /db_username/,
    /db_password/,
    /cluster0\.example/
  ];

  return placeholderPatterns.some((pattern) => pattern.test(normalized));
}

async function connectDB() {
  try {
    if (!process.env.MONGO_URI || isPlaceholderMongoUri(process.env.MONGO_URI)) {
      console.log('MongoDB not configured; continuing without database connection.');
      return false;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
}

module.exports = connectDB;

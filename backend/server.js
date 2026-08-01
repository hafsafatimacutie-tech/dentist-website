require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const path = require('path');
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const galleryRoutes = require('./routes/gallery');
const contentRoutes = require('./routes/content');

const app = express();
let dbReady = false;

connectDB().then((connected) => {
  dbReady = connected;
}).catch(() => {
  dbReady = false;
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: dbReady ? 'connected' : 'disconnected' });
});

app.use(cors());
app.use(express.json());

// Serve uploaded images statically at /uploads/<filename>
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/content', contentRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', database: dbReady ? 'connected' : 'disconnected' }));

const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));

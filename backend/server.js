// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Only declare once

const authRoutes = require('./routes/auth');
const dsaRoutes = require('./routes/dsa');

const app = express();
const PORT = process.env.PORT || 5050; // Use port from .env or default to 5050

// Middleware
const allowedOrigins = [
  'https://dsa-tracker-murex.vercel.app',
  'https://dsa-tracker-git-main-palaks-projects-09ea9c07.vercel.app',
  'http://localhost:3000', // For local development
  'https://localhost:3000'  // For local development with HTTPS
];

app.use(cors({
  origin: function(origin, callback){
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    // In development, allow all origins
    if(process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if(allowedOrigins.indexOf(origin) === -1){
      console.log(`CORS blocked request from: ${origin}`);
      const msg = `CORS policy does not allow access from ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json()); // Body parser for JSON requests

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dsatracker';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dsa', dsaRoutes);

// Basic route for testing server status
app.get('/', (req, res) => {
  res.json({ 
    message: 'DSA Tracker Backend API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

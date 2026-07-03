const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', require('./routes/problems'));
app.use('/api/dsa', require('./routes/dsa'));





// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend server is up and running!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
   dbName: 'dsa-tracker',
  useNewUrlParser: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT || 5050, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5050}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

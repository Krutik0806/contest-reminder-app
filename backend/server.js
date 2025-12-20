const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('./config/passport');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const contestRoutes = require('./routes/contests');
const reminderRoutes = require('./routes/reminders');

// Import scheduler
const { startScheduler } = require('./utils/scheduler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/reminders', reminderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the scheduler after database connection
    startScheduler();
    
    // Start keep-alive ping to prevent Render from sleeping
    startKeepAlive();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Keep-alive mechanism to prevent Render free tier from sleeping
const startKeepAlive = () => {
  const RENDER_URL = process.env.RENDER_URL || 'https://contest-reminder-app.onrender.com';
  
  // Self-ping every 3 minutes (180000 ms)
  setInterval(async () => {
    try {
      const response = await fetch(`${RENDER_URL}/api/health`);
      if (response.ok) {
        console.log('✅ Keep-alive ping successful at', new Date().toISOString());
      }
    } catch (error) {
      console.error('❌ Keep-alive ping failed:', error.message);
    }
  }, 180000); // 3 minutes
  
  console.log('🔄 Keep-alive mechanism started (pinging every 3 minutes)');
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

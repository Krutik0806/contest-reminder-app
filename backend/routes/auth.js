const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const passport = require('../config/passport');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create user
    const user = new User({
      email,
      password,
      name
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        whatsapp: req.user.whatsapp,
        notificationPermission: req.user.notificationPermission
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/me', auth, async (req, res) => {
  try {
    const updates = ['name', 'whatsapp', 'notificationPermission'];
    const allowedUpdates = {};
    
    updates.forEach(update => {
      if (req.body[update] !== undefined) {
        allowedUpdates[update] = req.body[update];
      }
    });
    
    Object.assign(req.user, allowedUpdates);
    await req.user.save();
    
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        whatsapp: req.user.whatsapp,
        notificationPermission: req.user.notificationPermission
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Save push subscription
router.post('/subscription', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    req.user.pushSubscription = subscription;
    req.user.notificationPermission = true;
    await req.user.save();
    
    res.json({ message: 'Subscription saved successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173/auth?error=google_auth_failed'
  }),
  async (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      // Redirect to frontend with token
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendURL}/auth?token=${token}&name=${encodeURIComponent(req.user.name)}`);
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=token_generation_failed`);
    }
  }
);

module.exports = router;

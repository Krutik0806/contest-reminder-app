const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const passport = require('../config/passport');
const { sendEmail } = require('../utils/emailService');
const { generateOTP, getOTPExpiry } = require('../utils/otpService');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
    
    // Create user (not verified yet)
    const user = new User({
      email,
      password,
      name,
      isVerified: false,
      verificationOTP: otp,
      otpExpiry: otpExpiry
    });
    
    await user.save();
    
    // Send OTP email
    try {
      await sendEmail(
        email,
        'Verify Your Email - Contest Reminder',
        `Hello ${name},\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.\n\nBest regards,\nContest Reminder Team`
      );
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Delete user if email fails
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ error: 'Failed to send verification email' });
    }
    
    res.status(201).json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user._id,
      email: user.email
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
    
    // Check if user is verified
    if (!user.isVerified && !user.googleId) {
      return res.status(403).json({ 
        error: 'Please verify your email first',
        needsVerification: true,
        userId: user._id,
        email: user.email
      });
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

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    
    // Check if OTP is expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    
    // Check if OTP matches
    if (user.verificationOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Verify user
    user.isVerified = true;
    user.verificationOTP = null;
    user.otpExpiry = null;
    await user.save();
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.json({
      message: 'Email verified successfully',
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

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    
    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
    
    user.verificationOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    // Send OTP email
    await sendEmail(
      user.email,
      'Verify Your Email - Contest Reminder',
      `Hello ${user.name},\n\nYour new verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nContest Reminder Team`
    );
    
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
  (req, res, next) => {
    passport.authenticate('google', {
      session: false
    }, (err, user, info) => {
      if (err) {
        console.error('Google auth error:', err);
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=auth_failed`);
      }
      
      if (!user) {
        console.error('No user returned from Google');
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=no_user`);
      }

      try {
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        // Redirect to frontend with token
        const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendURL}/auth?token=${token}&name=${encodeURIComponent(user.name)}`);
      } catch (error) {
        console.error('Token generation error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=token_failed`);
      }
    })(req, res, next);
  }
);

module.exports = router;

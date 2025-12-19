const express = require('express');
const router = express.Router();
const Contest = require('../models/Contest');
const { auth, adminAuth } = require('../middleware/auth');

// Get all contests (with filters)
router.get('/', async (req, res) => {
  try {
    const { platform, timeFilter } = req.query;
    const now = new Date();
    
    let query = { isCompleted: false };
    
    // Platform filter
    if (platform && platform !== 'all') {
      query.platform = platform;
    }
    
    // Time filter
    if (timeFilter === 'today') {
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      query.startTime = { $gte: now, $lte: endOfDay };
    } else if (timeFilter === 'week') {
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() + 7);
      query.startTime = { $gte: now, $lte: endOfWeek };
    } else {
      // Default: show all upcoming contests
      query.startTime = { $gte: now };
    }
    
    const contests = await Contest.find(query)
      .sort({ startTime: 1 })
      .populate('createdBy', 'name email');
    
    res.json(contests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single contest
router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    res.json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create contest (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, platform, startTime, duration, link, tags } = req.body;
    
    const contest = new Contest({
      name,
      platform,
      startTime,
      duration,
      link,
      tags,
      createdBy: req.user._id
    });
    
    await contest.save();
    res.status(201).json(contest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update contest (Admin only)
router.patch('/:id', auth, adminAuth, async (req, res) => {
  try {
    const updates = ['name', 'platform', 'startTime', 'duration', 'link', 'tags', 'isCompleted'];
    const allowedUpdates = {};
    
    updates.forEach(update => {
      if (req.body[update] !== undefined) {
        allowedUpdates[update] = req.body[update];
      }
    });
    
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    );
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    res.json(contest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete contest (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const contest = await Contest.findByIdAndDelete(req.params.id);
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    res.json({ message: 'Contest deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark contest as completed (Admin only)
router.patch('/:id/complete', auth, adminAuth, async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      { isCompleted: true },
      { new: true }
    );
    
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    res.json(contest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

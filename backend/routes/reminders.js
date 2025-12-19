const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const Contest = require('../models/Contest');
const { auth } = require('../middleware/auth');

// Get all reminders for current user
router.get('/', auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id })
      .populate('contestId');
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create reminder
router.post('/', auth, async (req, res) => {
  try {
    const { contestId, remindAt } = req.body;
    
    // Check if contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }
    
    // Check if contest has already started
    if (new Date(contest.startTime) < new Date()) {
      return res.status(400).json({ error: 'Cannot set reminder for past contest' });
    }
    
    // Check if reminder already exists
    let reminder = await Reminder.findOne({
      userId: req.user._id,
      contestId
    });
    
    if (reminder) {
      // Update existing reminder
      reminder.remindAt = remindAt;
      reminder.sent = {
        '1hr': false,
        '30min': false
      };
      await reminder.save();
    } else {
      // Create new reminder
      reminder = new Reminder({
        userId: req.user._id,
        contestId,
        remindAt,
        sent: {
          '1hr': false,
          '30min': false
        }
      });
      await reminder.save();
    }
    
    await reminder.populate('contestId');
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete reminder
router.delete('/:id', auth, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

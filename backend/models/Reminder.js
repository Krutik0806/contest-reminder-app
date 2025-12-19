const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true
  },
  remindAt: [{
    type: String,
    enum: ['1hr', '30min'],
    required: true
  }],
  sent: {
    type: Object,
    default: {
      '1hr': false,
      '30min': false
    }
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate reminders
reminderSchema.index({ userId: 1, contestId: 1 }, { unique: true });

module.exports = mongoose.model('Reminder', reminderSchema);

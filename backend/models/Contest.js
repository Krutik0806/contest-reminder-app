const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Codeforces', 'CodeChef', 'LeetCode', 'AtCoder', 'HackerRank', 'HackerEarth', 'TopCoder', 'Other']
  },
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for efficient querying
contestSchema.index({ startTime: 1, isCompleted: 1 });

module.exports = mongoose.model('Contest', contestSchema);

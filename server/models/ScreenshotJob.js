const mongoose = require('mongoose');

const screenshotJobSchema = new mongoose.Schema({
  appId: {
    type: String,
    required: true,
    trim: true
  },
  appUrl: {
    type: String,
    required: true
  },
  store: {
    type: String,
    required: true,
    enum: ['google', 'apple']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  screenshots: [{
    url: String,
    filename: String
  }],
  zipFile: {
    url: String,
    filename: String
  },
  errorMessage: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ScreenshotJob', screenshotJobSchema);
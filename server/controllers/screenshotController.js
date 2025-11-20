const ScreenshotJob = require('../models/ScreenshotJob');
const User = require('../models/User');
const Joi = require('joi');

// Request screenshots
exports.requestScreenshots = async (req, res) => {
  try {
    // Validate request body
    const schema = Joi.object({
      url: Joi.string().uri().required(),
      store: Joi.string().valid('google', 'apple').required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { url, store } = value;
    
    // Extract app ID from URL
    let appId = '';
    if (store === 'google') {
      const match = url.match(/id=([a-zA-Z0-9._-]+)/);
      if (match && match[1]) {
        appId = match[1];
      }
    } else {
      // For Apple App Store
      const match = url.match(/id(\d+)/);
      if (match && match[1]) {
        appId = match[1];
      }
    }

    if (!appId) {
      return res.status(400).json({ message: 'Invalid app URL' });
    }

    // Check user's download limit (for free users)
    if (req.user.subscription.plan === 'free') {
      // In a real implementation, you might want to check against a daily/monthly limit
      // For now, we'll just increment the count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { downloadCount: 1 }
      });
    }

    // Create screenshot job
    const screenshotJob = new ScreenshotJob({
      appId,
      appUrl: url,
      store,
      userId: req.user._id
    });

    await screenshotJob.save();

    // In a real implementation, you would queue this job for processing
    // For now, we'll simulate the processing
    res.status(201).json({
      _id: screenshotJob._id,
      appId,
      appUrl: url,
      store,
      status: 'pending',
      message: 'Screenshot job created successfully. Processing will begin shortly.'
    });
  } catch (error) {
    console.error('Screenshot request error:', error);
    res.status(500).json({ message: 'Server error requesting screenshots' });
  }
};

// Get screenshot job status
exports.getJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find job and ensure it belongs to the user
    const job = await ScreenshotJob.findOne({
      _id: id,
      userId: req.user._id
    });
    
    if (!job) {
      return res.status(404).json({ message: 'Screenshot job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Get job status error:', error);
    res.status(500).json({ message: 'Server error fetching job status' });
  }
};

// Get user's screenshot jobs
exports.getUserJobs = async (req, res) => {
  try {
    const jobs = await ScreenshotJob.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 jobs
    
    res.json(jobs);
  } catch (error) {
    console.error('Get user jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};
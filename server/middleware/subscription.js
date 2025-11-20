const User = require('../models/User');

const checkSubscription = (requiredPlan = 'free') => {
  return async (req, res, next) => {
    try {
      // Get user from request (added by auth middleware)
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // Check if user exists in database
      const dbUser = await User.findById(user._id);
      if (!dbUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Plan hierarchy
      const planHierarchy = {
        'free': 0,
        'pro': 1,
        'enterprise': 2
      };

      // Check if user's plan meets requirement
      const userPlan = dbUser.subscription.plan || 'free';
      const requiredPlanLevel = planHierarchy[requiredPlan];
      const userPlanLevel = planHierarchy[userPlan];

      if (userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({ 
          message: `Access denied. ${requiredPlan} plan or higher required.` 
        });
      }

      // Check if subscription is expired
      if (dbUser.subscription.expiresAt && new Date(dbUser.subscription.expiresAt) < new Date()) {
        // For now, downgrade to free instead of blocking completely
        dbUser.subscription.plan = 'free';
        await dbUser.save();
        req.user = dbUser;
      }

      next();
    } catch (error) {
      console.error('Subscription check error:', error);
      res.status(500).json({ message: 'Server error during subscription check' });
    }
  };
};

module.exports = checkSubscription;
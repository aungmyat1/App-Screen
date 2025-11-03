const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/database');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/payments/webhook', express.raw({type: 'application/json'})); // For Stripe webhook

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// Connect to MongoDB (but continue even if it fails)
let dbClient = null;
connectDB().then(client => {
  dbClient = client;
}).catch(error => {
  console.error('Database connection failed, continuing without database:', error.message);
});

// Routes
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    res.json({ 
      message: 'AppScreens API is running',
      mongodb: dbClient ? 'Connected' : 'Disconnected (but API is functional)'
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const gateway = require('./config/braintree');
    // Test Braintree connection
    await gateway.clientToken.generate({});
    
    res.status(200).json({
      status: 'OK',
      braintree: 'Connected',
      mongodb: dbClient ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// User routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/screenshots', require('./routes/screenshot.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB connection status will be displayed in health checks');
});
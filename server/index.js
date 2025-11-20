const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appscreens', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AppScreens API Server' });
});

// Authentication routes
app.use('/api/auth', require('./routes/auth'));

// Screenshot routes
app.use('/api/screenshots', require('./routes/screenshots'));

// Payment routes
app.use('/api/payment', require('./routes/payment'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
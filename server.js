const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://avishparekh06_db_user:X71yGDwWHyvAVdFf@toyota.hwjvpxh.mongodb.net/?retryWrites=true&w=majority&appName=toyota';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
db.once('open', () => {
  console.log('MongoDB connection opened');
});

// Routes
app.use('/api/cars', require('./routes/cars'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Test MongoDB connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const Car = require('./models/Car');
    const count = await Car.countDocuments();
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      carCount: count,
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      message: error.message,
      connectionState: mongoose.connection.readyState
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

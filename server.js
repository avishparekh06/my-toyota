const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://avishparekh06_db_user:X71yGDwWHyvAVdFf@toyota.hwjvpxh.mongodb.net/MyToyota?retryWrites=true&w=majority&appName=toyota';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
db.on('connected', () => {
  console.log('Connected to MongoDB successfully');
}); // Add the missing closing parenthesis
db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
db.once('open', () => {
  console.log('MongoDB connection opened');
});

// Routes
app.use('/api/cars', require('./routes/cars'));

// Health check endpoint for production monitoring
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

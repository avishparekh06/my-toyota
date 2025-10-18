const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  vin: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  year: { 
    type: Number, 
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  make: { 
    type: String, 
    required: true,
    trim: true,
    default: 'Toyota'
  },
  model: { 
    type: String, 
    required: true,
    trim: true
  },
  trim: { 
    type: String,
    trim: true
  },
  bodyStyle: { 
    type: String,
    trim: true
  },
  engine: {
    type: String,
    trim: true
  },
  horsepower: {
    type: Number
  },
  drivetrain: {
    type: String,
    trim: true
  },
  transmission: {
    type: String,
    trim: true
  },
  fuelType: {
    type: String,
    trim: true
  },
  mpgCity: {
    type: Number
  },
  mpgHighway: {
    type: Number
  },
  exteriorColor: {
    type: String,
    trim: true
  },
  interiorColor: {
    type: String,
    trim: true
  },
  stockNumber: {
    type: String,
    trim: true
  },
  msrp: {
    type: Number,
    required: true
  },
  dealerPrice: {
    type: Number
  },
  features: [{
    type: String,
    trim: true
  }],
  dimensions: {
    length: { type: String },
    width: { type: String },
    height: { type: String },
    wheelbase: { type: String }
  },
  status: {
    type: String,
    enum: ['In Stock', 'Out of Stock', 'In Transit', 'Sold', 'Reserved'],
    default: 'In Stock'
  },
  images: [{
    type: String
  }],
  location: {
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true }
  },
  dealership: {
    name: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    phone: { type: String, trim: true }
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
carSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create index for better search performance
carSchema.index({ make: 1, model: 1, year: 1 });
carSchema.index({ bodyType: 1 });
carSchema.index({ price: 1 });

module.exports = mongoose.model('Car', carSchema, 'car-data');

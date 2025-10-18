const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    min: 18,
    max: 120
  },
  location: {
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, default: 'USA' }
  },
  // New nested objects for personal and financial information
  personal: {
    familyInfo: {
      type: Number
    },
    avgCommuteDistance: {
      type: Number
    },
    location: {
      type: String
    },
    featurePreferences: [{
      type: String
    }],
    buildPreferences: [{
      type: String
    }],
    modelPreferences: [{
      type: String
    }],
    fuelType: {
      type: String
    },
    color: {
      type: String
    },
    year: {
      type: Number
    },
    buyingFor: {
      type: String
    }
  },
  finance: {
    householdIncome: {
      type: Number
    },
    creditScore: {
      type: Number
    },
    financeOrLease: {
      type: String
    },
    employmentStatus: {
      type: String
    },
    financingPriorities: [{
      type: String
    }]
  },
  // Keep existing fields for backward compatibility
  employmentStatus: {
    type: String,
    enum: ['Employed', 'Self-Employed', 'Unemployed', 'Retired', 'Student'],
    default: 'Employed'
  },
  annualIncome: {
    type: Number,
    min: 0
  },
  creditScore: {
    type: Number,
    min: 300,
    max: 850
  },
  preferences: {
    purchaseType: {
      type: String,
      enum: ['Cash', 'Finance', 'Lease'],
      default: 'Finance'
    },
    monthlyBudget: {
      type: Number,
      min: 0
    },
    preferredTermMonths: {
      type: Number,
      min: 12,
      max: 84
    },
    downPayment: {
      type: Number,
      min: 0
    },
    vehicleType: {
      type: String,
      enum: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback'],
      default: 'SUV'
    },
    modelInterest: [{
      type: String,
      trim: true
    }],
    features: [{
      type: String,
      trim: true
    }]
  },
  financingHistory: [{
    planType: {
      type: String,
      enum: ['Finance', 'Lease'],
      required: true
    },
    planId: String,
    vehicleModel: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    monthlyPayment: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled', 'Defaulted'],
      default: 'Active'
    }
  }],
  recommendations: [{
    model: {
      type: String,
      required: true,
      trim: true
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 1
    },
    reason: String
  }],
  simulations: [{
    simulationDate: {
      type: Date,
      default: Date.now
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true
    },
    loanTerm: {
      type: Number,
      required: true
    },
    interestRate: {
      type: Number,
      required: true
    },
    monthlyPayment: {
      type: Number,
      required: true
    },
    totalCost: {
      type: Number,
      required: true
    },
    downPayment: {
      type: Number,
      required: true
    }
  }],
  financialTipsViewed: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Method to get public profile (without password)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
};

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'location.city': 1, 'location.state': 1 });

module.exports = mongoose.model('User', userSchema);

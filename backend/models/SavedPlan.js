const mongoose = require('mongoose');

const SavedPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  plan: {
    id: String,
    type: String,
    name: String,
    term: String,
    downPayment: Number,
    monthlyPayment: Number,
    milesPerYear: String,
    residualValue: Number,
    apr: Number,
    description: String,
    features: [String],
    requirements: [String],
    totalAmount: Number,
    isRecommended: Boolean
  },
  car: {
    id: String,
    make: String,
    model: String,
    year: Number,
    trim: String,
    msrp: Number,
    dealerPrice: Number,
    location: {
      city: String,
      state: String
    }
  },
  financialInputs: {
    creditScore: String,
    annualIncome: String,
    downPayment: String,
    preferredTerm: String,
    monthlyBudget: String
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavedPlan', SavedPlanSchema);

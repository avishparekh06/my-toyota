const express = require('express');
const router = express.Router();
const SavedPlan = require('../models/SavedPlan');

// Save a new plan
router.post('/', async (req, res) => {
  try {
    const { plan, car, financialInputs, userId } = req.body;
    
    // Check if plan already exists for this user
    const existingPlan = await SavedPlan.findOne({
      userId: userId,
      'plan.id': plan.id,
      'car.id': car.id
    });

    if (existingPlan) {
      return res.status(400).json({ 
        message: 'Plan already saved',
        savedPlan: existingPlan 
      });
    }

    const savedPlan = new SavedPlan({
      userId,
      plan,
      car,
      financialInputs,
      savedAt: new Date()
    });

    await savedPlan.save();
    
    // Add the saved plan reference to the user
    const User = require('../models/User');
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedPlans: savedPlan._id } },
      { new: true }
    );
    
    res.status(201).json({ 
      message: 'Plan saved successfully',
      savedPlan 
    });
  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(500).json({ 
      message: 'Error saving plan',
      error: error.message 
    });
  }
});

// Get all saved plans for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const savedPlans = await SavedPlan.find({ userId })
      .sort({ savedAt: -1 }); // Most recent first
    
    res.json(savedPlans);
  } catch (error) {
    console.error('Error fetching saved plans:', error);
    res.status(500).json({ 
      message: 'Error fetching saved plans',
      error: error.message 
    });
  }
});

// Get user's saved plans using references (alternative approach)
router.get('/user-refs/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const User = require('../models/User');
    
    const user = await User.findById(userId).populate('savedPlans');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedPlans);
  } catch (error) {
    console.error('Error fetching saved plans via references:', error);
    res.status(500).json({ 
      message: 'Error fetching saved plans',
      error: error.message 
    });
  }
});

// Delete a saved plan
router.delete('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const deletedPlan = await SavedPlan.findByIdAndDelete(planId);
    
    if (!deletedPlan) {
      return res.status(404).json({ message: 'Saved plan not found' });
    }
    
    // Remove the saved plan reference from the user
    const User = require('../models/User');
    await User.findByIdAndUpdate(
      deletedPlan.userId,
      { $pull: { savedPlans: planId } },
      { new: true }
    );
    
    res.json({ 
      message: 'Plan deleted successfully',
      deletedPlan 
    });
  } catch (error) {
    console.error('Error deleting saved plan:', error);
    res.status(500).json({ 
      message: 'Error deleting saved plan',
      error: error.message 
    });
  }
});

// Export saved plans and recommended cars to CSV
router.get('/export/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const savedPlans = await SavedPlan.find({ userId })
      .sort({ savedAt: -1 });

    // Create CSV content
    const csvHeader = [
      'Saved Date',
      'Car Make',
      'Car Model', 
      'Car Year',
      'Car Trim',
      'MSRP',
      'Dealer Price',
      'Location',
      'Plan Type',
      'Plan Name',
      'Term',
      'Down Payment',
      'Monthly Payment',
      'APR',
      'Total Amount',
      'Credit Score',
      'Annual Income',
      'Monthly Budget',
      'Is Recommended'
    ].join(',');

    const csvRows = savedPlans.map(plan => [
      new Date(plan.savedAt).toLocaleDateString(),
      `"${plan.car.make}"`,
      `"${plan.car.model}"`,
      plan.car.year,
      `"${plan.car.trim || 'N/A'}"`,
      plan.car.msrp,
      plan.car.dealerPrice,
      `"${plan.car.location?.city || 'N/A'}, ${plan.car.location?.state || 'N/A'}"`,
      `"${plan.plan.type}"`,
      `"${plan.plan.name}"`,
      `"${plan.plan.term}"`,
      plan.plan.downPayment,
      plan.plan.monthlyPayment,
      plan.plan.apr,
      plan.plan.totalAmount,
      plan.financialInputs.creditScore,
      plan.financialInputs.annualIncome,
      plan.financialInputs.monthlyBudget,
      plan.plan.isRecommended ? 'Yes' : 'No'
    ].join(','));

    const csvContent = [csvHeader, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="saved-plans.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting saved plans:', error);
    res.status(500).json({ 
      message: 'Error exporting saved plans',
      error: error.message 
    });
  }
});

module.exports = router;

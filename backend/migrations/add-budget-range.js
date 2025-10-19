// Migration script to add budgetRange field to existing users
// Run this script once to update existing users with default budget range

const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/toyota-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function
const addBudgetRangeToUsers = async () => {
  try {
    console.log('Starting migration: Adding budgetRange to existing users...');
    
    // Find all users without budgetRange
    const usersWithoutBudgetRange = await User.find({
      $or: [
        { 'finance.budgetRange': { $exists: false } },
        { 'finance.budgetRange': null }
      ]
    });

    console.log(`Found ${usersWithoutBudgetRange.length} users without budget range`);

    // Update each user with default budget range based on their income
    for (const user of usersWithoutBudgetRange) {
      const income = user.finance?.householdIncome || user.annualIncome || 75000;
      
      // Calculate default budget range based on income
      const defaultMin = Math.round(income * 0.2); // 20% of income
      const defaultMax = Math.round(income * 0.4); // 40% of income
      
      // Ensure min is at least 15000 and max is at least 25000
      const min = Math.max(defaultMin, 15000);
      const max = Math.max(defaultMax, 25000);
      
      // Update user with budget range
      await User.findByIdAndUpdate(user._id, {
        $set: {
          'finance.budgetRange': {
            min: min,
            max: max
          }
        }
      });
      
      console.log(`Updated user ${user.email} with budget range: $${min.toLocaleString()} - $${max.toLocaleString()}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await addBudgetRangeToUsers();
};

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { addBudgetRangeToUsers };

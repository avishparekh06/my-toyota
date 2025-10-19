// Migration script to ensure phone field is properly handled for existing users
// This script ensures that existing users have the phone field available

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
const ensurePhoneField = async () => {
  try {
    console.log('Starting migration: Ensuring phone field is available for all users...');
    
    // Find all users
    const allUsers = await User.find({});
    console.log(`Found ${allUsers.length} total users`);

    // Count users without phone field
    const usersWithoutPhone = await User.find({
      $or: [
        { phone: { $exists: false } },
        { phone: null },
        { phone: '' }
      ]
    });

    console.log(`Found ${usersWithoutPhone.length} users without phone number`);

    // The phone field already exists in the schema, so we just need to ensure it's properly initialized
    // No actual data migration is needed since the field is optional and already defined in the schema
    
    console.log('Phone field migration completed successfully!');
    console.log('Note: Phone field is optional and already defined in the User schema.');
    console.log('Users can now add their phone number through the profile forms.');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await ensurePhoneField();
};

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { ensurePhoneField };

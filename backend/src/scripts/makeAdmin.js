const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const user = await User.findOne();
    if (!user) {
      console.log('No user found in DB.');
      process.exit(1);
    }

    user.role = 'admin';
    user.wishlist = []; // Clear current wishlist to avoid ObjectId cast errors
    await user.save();

    console.log(`Successfully promoted ${user.email} to Admin!`);
    process.exit(0);
  } catch (err) {
    console.error('Promotion failed:', err);
    process.exit(1);
  }
}

makeAdmin();

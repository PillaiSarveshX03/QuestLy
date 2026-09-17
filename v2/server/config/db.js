const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 3000) => {
  const uri = process.env.MONGO_URI || 'mongodb://questly-db:27017/questly';

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Connecting to MongoDB (attempt ${attempt}/${retries}) at: ${uri}`);
      await mongoose.connect(uri);
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`⚠️ MongoDB connection attempt ${attempt} failed:`, error.message);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('❌ Could not connect to MongoDB after maximum attempts.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
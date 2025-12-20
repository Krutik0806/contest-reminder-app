const mongoose = require('mongoose');
const Contest = require('./models/Contest');
require('dotenv').config();

const addTestContest = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create test contest starting in 35 minutes from now
    const now = new Date();
    const startTime = new Date(now.getTime() + 35 * 60 * 1000); // 35 minutes from now
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const testContest = new Contest({
      name: 'Immediate Test - 30min Notification',
      platform: 'CodeChef',
      link: 'https://www.codechef.com/test',
      startTime: startTime,
      endTime: endTime,
      duration: 120, // 2 hours in minutes
      isCompleted: false
    });

    await testContest.save();
    console.log('✅ Test contest added successfully!');
    console.log(`📅 Start Time: ${startTime.toLocaleString()}`);
    console.log(`📅 End Time: ${endTime.toLocaleString()}`);
    console.log(`🆔 Contest ID: ${testContest._id}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding test contest:', error);
    mongoose.connection.close();
  }
};

addTestContest();

require('dotenv').config();
const mongoose = require('mongoose');
const Contest = require('../models/Contest');

async function addTestContest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create a contest that starts in 35 minutes
    // So when user sets "30min" reminder, it triggers in ~5 minutes
    const startTime = new Date();
    startTime.setMinutes(startTime.getMinutes() + 35);

    const testContest = {
      name: '🧪 TEST CONTEST - Email Notification Test',
      platform: 'Codeforces',
      startTime: startTime,
      duration: '2 hours',
      link: 'https://codeforces.com/test'
    };

    const contest = await Contest.create(testContest);
    
    console.log('\n🎉 Test contest created successfully!');
    console.log('\n📋 Contest Details:');
    console.log(`   Name: ${contest.name}`);
    console.log(`   Start Time: ${contest.startTime.toLocaleString()}`);
    console.log(`   (${Math.round((contest.startTime - new Date()) / 1000 / 60)} minutes from now)`);
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Start backend: npm run dev');
    console.log('   2. Start frontend and login');
    console.log('   3. Set "30 min" reminder on this test contest');
    console.log('   4. Wait ~5 minutes');
    console.log('   5. Check your email and console logs!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestContest();

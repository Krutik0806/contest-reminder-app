const mongoose = require('mongoose');
const Reminder = require('./models/Reminder');
const Contest = require('./models/Contest');
const User = require('./models/User');
require('dotenv').config();

const checkReminders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the test contest
    const testContest = await Contest.findOne({ name: 'Test Contest - Notification Check' });
    if (!testContest) {
      console.log('❌ Test contest not found!');
      mongoose.connection.close();
      return;
    }

    console.log('✅ Test contest found:');
    console.log(`   ID: ${testContest._id}`);
    console.log(`   Start Time: ${testContest.startTime}`);
    console.log(`   Now: ${new Date()}`);
    
    const minutesUntilStart = Math.floor((testContest.startTime - new Date()) / (1000 * 60));
    console.log(`   Minutes until start: ${minutesUntilStart}`);

    // Find reminders for this contest
    const reminders = await Reminder.find({ contestId: testContest._id }).populate('userId');
    
    if (reminders.length === 0) {
      console.log('❌ No reminders set for this contest!');
      console.log('   Go to the website and click "Set Reminder" button');
    } else {
      console.log(`✅ Found ${reminders.length} reminder(s):`);
      reminders.forEach((reminder, i) => {
        console.log(`\n   Reminder ${i + 1}:`);
        console.log(`   - User: ${reminder.userId.email}`);
        console.log(`   - Remind At: ${reminder.remindAt}`);
        console.log(`   - Sent 1hr: ${reminder.sent?.['1hr'] || false}`);
        console.log(`   - Sent 30min: ${reminder.sent?.['30min'] || false}`);
      });
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

checkReminders();

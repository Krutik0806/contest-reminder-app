// Database initialization script
// Run this script to create sample data in your database

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Models
const User = require('./models/User');
const Contest = require('./models/Contest');

const initializeDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...\n');

    // Create admin user
    console.log('Creating admin user...');
    const adminExists = await User.findOne({ email: 'chamthakrutik4@gmail.com' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'Krutik',
        email: 'chamthakrutik4@gmail.com',
        password: 'Krutik@123',
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created!');
      console.log('   Email: chamthakrutik4@gmail.com');
      console.log('   Password: Krutik@123\n');
    } else {
      console.log('ℹ️  Admin user already exists\n');
    }

    // Create test user
    console.log('Creating test user...');
    const userExists = await User.findOne({ email: 'user@example.com' });
    
    if (!userExists) {
      const user = new User({
        name: 'Test User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user'
      });
      await user.save();
      console.log('✅ Test user created!');
      console.log('   Email: user@example.com');
      console.log('   Password: user123\n');
    } else {
      console.log('ℹ️  Test user already exists\n');
    }

    // Create sample contests
    console.log('Creating sample contests...');
    const contestCount = await Contest.countDocuments();
    
    if (contestCount === 0) {
      const now = new Date();
      
      const sampleContests = [
        {
          name: 'Codeforces Round 918 (Div. 2)',
          platform: 'Codeforces',
          startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
          duration: '2 hours',
          link: 'https://codeforces.com/contests',
          tags: ['Div 2', 'Rated']
        },
        {
          name: 'CodeChef Starters 115',
          platform: 'CodeChef',
          startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          duration: '3 hours',
          link: 'https://www.codechef.com/START115',
          tags: ['Starters', 'Weekly']
        },
        {
          name: 'LeetCode Weekly Contest 378',
          platform: 'LeetCode',
          startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
          duration: '1.5 hours',
          link: 'https://leetcode.com/contest',
          tags: ['Weekly']
        },
        {
          name: 'AtCoder Beginner Contest 335',
          platform: 'AtCoder',
          startTime: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // In 4 days
          duration: '1 hour 40 minutes',
          link: 'https://atcoder.jp/contests/abc335',
          tags: ['ABC', 'Beginner']
        },
        {
          name: 'Test Reminder (1 hour from now)',
          platform: 'Other',
          startTime: new Date(now.getTime() + 60 * 60 * 1000), // 1 hour from now
          duration: '30 minutes',
          link: 'https://example.com',
          tags: ['Test']
        }
      ];

      const admin = await User.findOne({ email: 'admin@example.com' });
      
      for (const contestData of sampleContests) {
        const contest = new Contest({
          ...contestData,
          createdBy: admin._id
        });
        await contest.save();
        console.log(`✅ Created: ${contestData.name}`);
      }
      console.log('\n✅ All sample contests created!\n');
    } else {
      console.log(`ℹ️  ${contestCount} contest(s) already exist\n`);
    }

    console.log('✨ Database initialization complete!\n');
    console.log('📝 Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Contests: ${await Contest.countDocuments()}`);
    console.log('\n🚀 You can now start the application!');
    console.log('   Backend: npm run dev');
    console.log('   Frontend: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();

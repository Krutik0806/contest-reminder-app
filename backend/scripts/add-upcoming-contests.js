require('dotenv').config();
const mongoose = require('mongoose');
const Contest = require('../models/Contest');

async function addUpcomingContests() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Only add future contests (Dec 19 evening onwards)
    const upcomingContests = [
      {
        name: 'Codeforces Global Round 31 (Div. 1 + Div. 2)',
        platform: 'Codeforces',
        startTime: new Date('2025-12-19T20:05:00+05:30'), // 8:05 PM IST
        duration: '2 hours 30 minutes',
        link: 'https://codeforces.com/contests/2180'
      },
      {
        name: 'Biweekly Contest 172',
        platform: 'LeetCode',
        startTime: new Date('2025-12-20T20:00:00+05:30'), // 8:00 PM IST
        duration: '1 hour 30 minutes',
        link: 'https://leetcode.com/contest/biweekly-contest-172'
      },
      {
        name: 'Weekly Contest 481',
        platform: 'LeetCode',
        startTime: new Date('2025-12-21T08:00:00+05:30'), // 8:00 AM IST
        duration: '1 hour 30 minutes',
        link: 'https://leetcode.com/contest/weekly-contest-481'
      },
      {
        name: 'Starters 218',
        platform: 'CodeChef',
        startTime: new Date('2025-12-24T20:00:00+05:30'), // Next week
        duration: '2 hours',
        link: 'https://www.codechef.com/START218'
      }
    ];

    // Filter out past contests
    const now = new Date();
    const futureContests = upcomingContests.filter(c => c.startTime > now);

    console.log(`\n📅 Adding ${futureContests.length} upcoming contests...\n`);

    for (const contestData of futureContests) {
      const contest = await Contest.create(contestData);
      console.log(`✅ Added: ${contest.name}`);
      console.log(`   Platform: ${contest.platform}`);
      console.log(`   Start: ${contest.startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
      console.log('');
    }

    console.log('🎉 All upcoming contests added successfully!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addUpcomingContests();

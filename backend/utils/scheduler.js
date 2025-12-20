const cron = require('node-cron');
const Contest = require('../models/Contest');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const webpush = require('web-push');
const { sendContestReminderEmail } = require('./emailService');

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const sendPushNotification = async (subscription, payload) => {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    
    // Get all upcoming contests
    const upcomingContests = await Contest.find({
      startTime: { $gte: now },
      isCompleted: false
    });
    
    for (const contest of upcomingContests) {
      const contestStartTime = new Date(contest.startTime);
      const timeDiff = contestStartTime - now;
      
      // Convert to minutes
      const minutesUntilStart = Math.floor(timeDiff / (1000 * 60));
      
      // Check for 1 hour reminder (58-62 minutes to handle cron timing)
      if (minutesUntilStart >= 58 && minutesUntilStart <= 62) {
        await sendReminders(contest, '1hr');
      }
      
      // Check for 30 min reminder (28-32 minutes)
      if (minutesUntilStart >= 28 && minutesUntilStart <= 32) {
        await sendReminders(contest, '30min');
      }
    }
  } catch (error) {
    console.error('Error in checkAndSendReminders:', error);
  }
};

const sendReminders = async (contest, timeType) => {
  try {
    // Find all reminders for this contest that haven't been sent yet
    const reminders = await Reminder.find({
      contestId: contest._id,
      remindAt: timeType,
      [`sent.${timeType}`]: false
    }).populate('userId');
    
    for (const reminder of reminders) {
      const user = reminder.userId;
      const timeText = timeType === '1hr' ? '1 hour' : '30 minutes';
      
      // Send browser notification if user has subscription
      if (user.pushSubscription) {
        const payload = {
          title: '🚨 Contest Reminder',
          body: `${contest.name} starts in ${timeText}!`,
          icon: '/logo.png',
          badge: '/badge.png',
          data: {
            url: contest.link,
            contestId: contest._id
          }
        };
        
        const sent = await sendPushNotification(user.pushSubscription, payload);
        
        if (sent) {
          console.log(`📬 Push notification sent to ${user.email} for ${contest.name}`);
        }
      }
      
      // Send email notification
      try {
        await sendContestReminderEmail(
          user.email,
          contest.name,
          contest.link,
          timeText
        );
        console.log(`📧 Email sent to ${user.email} for ${contest.name}`);
        
        // Mark as sent only if email succeeds
        if (!reminder.sent) {
          reminder.sent = {};
        }
        reminder.sent[timeType] = true;
        reminder.markModified('sent');
        await reminder.save();
        console.log(`✅ Marked reminder as sent for ${user.email} - ${timeType}`);
      } catch (emailError) {
        console.error(`❌ Failed to send email to ${user.email}:`, emailError.message);
        // Don't mark as sent if email failed - will retry next time
      }
    }
  } catch (error) {
    console.error('Error in sendReminders:', error);
  }
};

// Run every minute
const startScheduler = () => {
  console.log('🚀 Starting reminder scheduler...');
  
  // Run immediately on startup
  checkAndSendReminders();
  
  // Then run every 5 minutes (reduce frequency to save resources)
  cron.schedule('*/5 * * * *', () => {
    console.log('🔍 Checking for reminders...', new Date().toISOString());
    checkAndSendReminders();
  });
  
  console.log('✅ Scheduler started successfully');
};

module.exports = { startScheduler };

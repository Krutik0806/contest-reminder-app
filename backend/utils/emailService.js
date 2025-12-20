let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.error('Failed to load nodemailer:', error);
}

// Create transporter
const createTransporter = () => {
  // For Gmail: Use app-specific password or enable less secure apps
  // For testing: Use ethereal.email (fake SMTP)
  
  if (!nodemailer) {
    console.log('⚠️  Nodemailer not available');
    return null;
  }
  
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }
  
  // Default: Log to console (no actual email sent)
  return null;
};

const sendContestReminderEmail = async (userEmail, contestName, contestLink, timeUntil) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log(`[EMAIL SIMULATION] Would send to ${userEmail}: ${contestName} starts in ${timeUntil}`);
      return true;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Contest Reminder <noreply@contestreminder.com>',
      to: userEmail,
      subject: `🚨 Contest Reminder: ${contestName} starts in ${timeUntil}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Contest Starting Soon!</h1>
            </div>
            <div class="content">
              <h2>${contestName}</h2>
              <p style="font-size: 18px; color: #EF4444;">
                <strong>Starts in ${timeUntil}!</strong>
              </p>
              <p>Don't miss this contest! Click the button below to go to the contest page:</p>
              <a href="${contestLink}" class="button" style="color: white;">Go to Contest →</a>
              <p style="margin-top: 30px; color: #666;">
                Good luck and happy coding! 🚀
              </p>
            </div>
            <div class="footer">
              <p>You're receiving this because you set a reminder for this contest.</p>
              <p>Contest Reminder App | Never miss a coding contest</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Contest Reminder!
        
        ${contestName} starts in ${timeUntil}!
        
        Contest Link: ${contestLink}
        
        Good luck and happy coding!
        
        ---
        Contest Reminder App
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${userEmail} for ${contestName}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
};

module.exports = {
  sendContestReminderEmail
};

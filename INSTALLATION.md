# 🚀 Installation Guide for Beginners

This guide will walk you through every step to get the Contest Reminder app running on your computer.

## 📋 Prerequisites (Things you need to install first)

### 1. Install Node.js
1. Go to https://nodejs.org/
2. Download the **LTS version** (e.g., 20.x.x)
3. Run the installer
4. Keep clicking "Next" with default settings
5. Finish installation

**Verify installation:**
```bash
# Open PowerShell and type:
node --version
npm --version

# Should show version numbers like:
# v20.10.0
# 10.2.3
```

### 2. Install MongoDB

#### Option A: Local Installation (Recommended for Beginners)
1. Go to https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Run the installer
4. **Important:** Check "Install MongoDB as a Service"
5. Keep all other default settings
6. Finish installation

**Verify MongoDB is running:**
```bash
# Open PowerShell
net start | findstr /i "MongoDB"

# Should show: MongoDB Server (MongoDB)
```

#### Option B: MongoDB Atlas (Cloud - No Installation)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (choose free tier)
4. Wait for cluster to be created (3-5 minutes)
5. Click "Connect"
6. Add your IP address (or 0.0.0.0/0 for all)
7. Create a database user (username + password)
8. Choose "Connect your application"
9. Copy the connection string
10. Save it for later (you'll need it in .env file)

### 3. Install Git (Optional but Recommended)
1. Go to https://git-scm.com/download/win
2. Download and install
3. Keep default settings

---

## 📥 Download the Project

### If you have the ZIP file:
1. Extract the ZIP file to Desktop
2. You should see: `Contest Reminder Web app` folder

### If using Git:
```bash
cd Desktop
git clone <repository-url>
cd "Contest Reminder Web app"
```

---

## ⚙️ Setup Instructions

### Step 1: Setup Backend

#### 1.1 Open PowerShell in Backend Folder
```bash
cd "C:\Users\YourUsername\Desktop\Contest Reminder Web app\backend"
```

#### 1.2 Install Dependencies
```bash
npm install
```
*This will take 2-3 minutes. You'll see lots of text - that's normal!*

#### 1.3 Generate VAPID Keys
```bash
npx web-push generate-vapid-keys
```

**You will see output like:**
```
=======================================
Public Key:
BKxXXXXXXXXXXXXXXXXXXXXX...

Private Key:
abcXXXXXXXXXXXXXXXXXXXXX...
=======================================
```

**IMPORTANT:** Copy these keys! You'll need them in the next step.

#### 1.4 Configure Environment Variables

1. Open `backend` folder in File Explorer
2. Find the file `.env.example`
3. Right-click → "Open with" → Notepad
4. You'll see:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/contest-reminder
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   VAPID_PUBLIC_KEY=
   VAPID_PRIVATE_KEY=
   VAPID_SUBJECT=mailto:your-email@example.com
   ```

5. **Fill in the values:**
   - Keep `PORT=5000` as is
   - For **MONGODB_URI**:
     - If local MongoDB: `mongodb://localhost:27017/contest-reminder`
     - If Atlas: Paste your connection string from Atlas
   - For **JWT_SECRET**: Type any random long string (or use the generator command below)
   - For **VAPID_PUBLIC_KEY**: Paste the Public Key you copied
   - For **VAPID_PRIVATE_KEY**: Paste the Private Key you copied
   - For **VAPID_SUBJECT**: Enter your email

6. Save the file as `.env` (not `.env.example`, just `.env`)
   - File → Save As
   - File name: `.env`
   - Save as type: All Files
   - Click Save

**To generate a random JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 1.5 Initialize Database (Optional - adds sample data)
```bash
npm run init-db
```

This will create:
- An admin user (email: admin@example.com, password: admin123)
- A test user (email: user@example.com, password: user123)
- 5 sample contests

#### 1.6 Start Backend Server
```bash
npm run dev
```

**You should see:**
```
Server running on port 5000
Connected to MongoDB
Starting reminder scheduler...
Checking for reminders...
```

**✅ Backend is running! Keep this window open.**

---

### Step 2: Setup Frontend

#### 2.1 Open NEW PowerShell Window
Press `Windows Key`, type "PowerShell", press Enter

#### 2.2 Navigate to Frontend
```bash
cd "C:\Users\YourUsername\Desktop\Contest Reminder Web app\frontend"
```

#### 2.3 Install Dependencies
```bash
npm install
```
*This will take 2-3 minutes.*

#### 2.4 Start Frontend Server
```bash
npm run dev
```

**You should see:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  press h to show help
```

**✅ Frontend is running!**

---

## 🎉 Access the Application

1. Open your web browser (Chrome or Edge recommended)
2. Go to: http://localhost:3000
3. You should see the Contest Reminder login page!

---

## 👤 First Time Login

### Option 1: Use Sample Data (if you ran init-db)
- **Admin Account:**
  - Email: admin@example.com
  - Password: admin123

- **User Account:**
  - Email: user@example.com
  - Password: user123

### Option 2: Create New Account
1. Click "Sign up"
2. Enter your details
3. Click "Sign up" button

### Make Yourself Admin (Optional)

#### Using MongoDB Compass (GUI Method):
1. Download MongoDB Compass from https://www.mongodb.com/try/download/compass
2. Install and open it
3. Connect to: `mongodb://localhost:27017`
4. Click on database: `contest-reminder`
5. Click on collection: `users`
6. Find your user document
7. Double-click on the "role" field
8. Change "user" to "admin"
9. Click the checkmark to save
10. Logout and login again

#### Using Command Line:
```bash
# Open PowerShell
mongo contest-reminder

# Type this command (replace with your email):
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

# Exit
exit
```

---

## 🔔 Testing Notifications

### Step 1: Enable Notifications
1. Login to the app
2. Browser will ask: "Allow notifications?"
3. Click **"Allow"**

### Step 2: Add a Test Contest (Admin Only)
1. Go to "Admin Panel"
2. Click "Add Contest"
3. Fill in:
   - Name: Test Contest
   - Platform: Any
   - Start Time: **Set to exactly 1 hour from now**
   - Duration: 30 minutes
   - Link: https://example.com
4. Click "Create"

### Step 3: Set Reminder
1. Go back to "Dashboard"
2. Find your test contest
3. Click "Remind Me"
4. Check that button changes to "✓ Reminder Set"

### Step 4: Wait for Notification
- In about 1-2 minutes, you should get a notification
- (The cron job runs every minute and checks for contests)
- You'll see notification even if you close the browser!

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH
1. Restart your computer
2. Try `node --version` again
3. If still doesn't work, reinstall Node.js

### Problem: MongoDB connection error
**Solution:**
```bash
# Check if MongoDB is running
net start MongoDB

# If not running:
net start MongoDB
```

### Problem: Port 5000 already in use
**Solution:** Change port in `.env`:
```env
PORT=5001
```

### Problem: Port 3000 already in use
**Solution:** Stop other applications using port 3000, or:
1. Open `frontend/vite.config.js`
2. Change port to 3001

### Problem: Notifications not appearing
**Solutions:**
1. Check browser notification permissions
2. Make sure you clicked "Allow" when prompted
3. Try in Chrome or Edge (best support)
4. Check Windows notification settings
5. Ensure contest time is exactly 60 minutes from now

### Problem: Can't see Admin Panel
**Solutions:**
1. Make sure you changed user role to "admin" in database
2. Logout and login again
3. Check browser console for errors (F12)

---

## 🎯 Quick Start (After First Setup)

### Every time you want to use the app:

#### Option 1: Use the Batch Script
1. Double-click `start.bat` in project folder
2. Wait for both servers to start
3. Open browser: http://localhost:3000

#### Option 2: Manual Start
1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open browser: http://localhost:3000

---

## 📚 Next Steps

1. ✅ Read [README.md](README.md) for detailed features
2. ✅ Check [SETUP.md](SETUP.md) for advanced configuration
3. ✅ Review [PROJECT_DOCS.md](PROJECT_DOCS.md) for technical details
4. ✅ Use [SAMPLE_DATA.md](SAMPLE_DATA.md) to add more contests

---

## ❓ Need Help?

### Common Questions:

**Q: Do I need to keep PowerShell windows open?**
A: Yes! Both backend and frontend need to run simultaneously.

**Q: Can I close my browser and still get notifications?**
A: Yes! Once you grant permission, notifications work even when browser is closed.

**Q: How do I stop the servers?**
A: Press `Ctrl + C` in each PowerShell window.

**Q: Can my friends use this app?**
A: They need to run it on their own computers, OR you can deploy it online (see README.md for deployment instructions).

**Q: Is this free to use?**
A: Yes! Everything is free and open source.

---

## 🎓 For College Project Submission

### What to Include:
1. ✅ Screenshots of the application
2. ✅ README.md and documentation
3. ✅ Source code (zip file or GitHub link)
4. ✅ Database schema (in PROJECT_DOCS.md)
5. ✅ Architecture diagram (in PROJECT_DOCS.md)
6. ✅ Demo video (recommended)

### Demo Talking Points:
1. Show registration and login
2. Demonstrate contest filters
3. Show admin panel and adding contests
4. Set a reminder and show notification
5. Explain the tech stack (MERN)
6. Discuss the cron job scheduler
7. Show responsive design (resize browser)
8. Explain security features (JWT, bcrypt)

---

**Congratulations! You've successfully set up the Contest Reminder App! 🎉**

If you encounter any issues not covered here, check the browser console (F12) and backend terminal for error messages.

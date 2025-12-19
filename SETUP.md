# 🚀 Quick Setup Guide

## Step-by-Step Setup Instructions

### 1️⃣ Install MongoDB

#### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service
5. MongoDB will start automatically

#### Verify MongoDB is running:
```bash
# Open PowerShell and run:
mongo --version
```

### 2️⃣ Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Generate VAPID keys for push notifications
npx web-push generate-vapid-keys
```

**Copy the VAPID keys output and update .env file:**

Example output:
```
Public Key: BKxXX...
Private Key: abc123...
```

**Update backend/.env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contest-reminder
JWT_SECRET=my_super_secret_jwt_key_12345
VAPID_PUBLIC_KEY=paste_your_public_key_here
VAPID_PRIVATE_KEY=paste_your_private_key_here
VAPID_SUBJECT=mailto:your-email@example.com
```

**Start backend server:**
```bash
npm run dev
```

You should see:
```
Server running on port 5000
Connected to MongoDB
Starting reminder scheduler...
```

### 3️⃣ Setup Frontend

Open a **NEW** terminal (keep backend running):

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 4️⃣ Create Admin Account

1. Open browser: http://localhost:3000
2. Click "Sign up"
3. Register with:
   - Name: Admin
   - Email: admin@example.com
   - Password: admin123

4. **Make this user an admin:**

Open MongoDB:
```bash
# Option 1: MongoDB Shell
mongo contest-reminder

# Run this command:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

**OR use MongoDB Compass (GUI):**
1. Download MongoDB Compass
2. Connect to: mongodb://localhost:27017
3. Open database: contest-reminder
4. Open collection: users
5. Find your user document
6. Edit: Change "role" from "user" to "admin"
7. Save

5. **Logout and login again** to see Admin Panel

### 5️⃣ Test the Application

#### Add a Test Contest (Admin):
1. Login as admin
2. Click "Admin Panel"
3. Click "Add Contest"
4. Fill in details:
   ```
   Contest Name: Test Contest
   Platform: Codeforces
   Start Time: [Set to 1 hour from now]
   Duration: 2 hours
   Link: https://codeforces.com
   ```
5. Click "Create"

#### Set a Reminder:
1. Go back to Dashboard
2. Find your test contest
3. Click "Remind Me"
4. Allow browser notifications when prompted
5. Wait for notification!

### 6️⃣ Verify Everything Works

✅ Backend running on port 5000  
✅ Frontend running on port 3000  
✅ MongoDB connected  
✅ Can register/login  
✅ Admin panel accessible  
✅ Can add contests  
✅ Can set reminders  
✅ Browser notifications enabled  

## 🐛 Common Issues

### MongoDB Connection Error
**Error:** `MongooseServerSelectionError`

**Solution:**
```bash
# Check if MongoDB is running
net start MongoDB
```

### Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Change port in backend/.env
PORT=5001
```

### Notifications Not Working
**Problem:** Not receiving notifications

**Solutions:**
1. Check browser notification permissions
2. Ensure you clicked "Allow" when prompted
3. Test in Chrome/Edge (best support)
4. Check browser settings → Site Settings → Notifications
5. Add contest with start time exactly 1 hour from now

### VAPID Keys Missing
**Error:** `VAPID keys are not set`

**Solution:**
```bash
cd backend
npx web-push generate-vapid-keys
# Copy output to .env file
```

## 📱 Testing Notifications

### Quick Test:
1. Add a contest starting in 60 minutes
2. Set reminder
3. Wait 1-2 minutes (cron checks every minute)
4. Check console: "Checking for reminders..."
5. Should receive notification between 58-62 minutes

### Manual Test:
Modify backend/utils/scheduler.js temporarily:
```javascript
// Change from 58-62 to 55-65 for wider window
if (minutesUntilStart >= 55 && minutesUntilStart <= 65) {
```

## 🎯 Next Steps

1. **Populate Contests:**
   - Add real contests from Codeforces, CodeChef, etc.
   - Use actual contest URLs
   - Set correct times

2. **Invite Users:**
   - Share the app with friends
   - They can register and set reminders

3. **Monitor:**
   - Check backend console for cron logs
   - Watch for "Notification sent" messages

4. **Customize:**
   - Change colors in tailwind.config.js
   - Modify notification timings in scheduler.js
   - Add more platforms

## 🚀 Production Deployment

### When ready to deploy:

1. **Backend → Render/Railway:**
   - Push code to GitHub
   - Connect repository
   - Set environment variables
   - Deploy

2. **Frontend → Vercel/Netlify:**
   ```bash
   cd frontend
   npm run build
   # Deploy dist/ folder
   ```

3. **MongoDB → Atlas:**
   - Create free cluster
   - Update MONGODB_URI
   - Whitelist IP: 0.0.0.0/0

4. **Update Frontend API URL:**
   ```javascript
   // frontend/src/services/api.js
   const API_URL = 'https://your-backend.com/api';
   ```

---

**Need Help?** Check README.md for detailed documentation!

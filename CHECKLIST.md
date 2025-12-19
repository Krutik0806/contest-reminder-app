# ✅ Quick Start Checklist

Use this checklist to quickly set up and verify your Contest Reminder app.

---

## 📋 Pre-Installation Checklist

- [ ] Node.js installed (version 16+)
- [ ] MongoDB installed and running OR MongoDB Atlas account created
- [ ] Git installed (optional)
- [ ] Text editor installed (VS Code recommended)
- [ ] Modern browser (Chrome or Edge recommended)

---

## 🔧 Setup Checklist

### Backend Setup
- [ ] Navigate to `backend` folder
- [ ] Run `npm install`
- [ ] Generate VAPID keys: `npx web-push generate-vapid-keys`
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all `.env` variables:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] VAPID_PUBLIC_KEY
  - [ ] VAPID_PRIVATE_KEY
  - [ ] VAPID_SUBJECT
- [ ] (Optional) Run `npm run init-db` for sample data
- [ ] Start server: `npm run dev`
- [ ] Verify: "Server running on port 5000"
- [ ] Verify: "Connected to MongoDB"
- [ ] Verify: "Starting reminder scheduler..."

### Frontend Setup
- [ ] Open new terminal
- [ ] Navigate to `frontend` folder
- [ ] Run `npm install`
- [ ] Start server: `npm run dev`
- [ ] Verify: "Local: http://localhost:3000/"
- [ ] Open browser to http://localhost:3000
- [ ] Verify: Login page appears

---

## 👤 User Account Setup

### Create Account
- [ ] Click "Sign up"
- [ ] Enter name, email, password
- [ ] Click "Sign up" button
- [ ] Verify: Successfully logged in

### Make Admin (for Admin Panel access)
- [ ] Open MongoDB Compass OR MongoDB Shell
- [ ] Connect to database: `contest-reminder`
- [ ] Find collection: `users`
- [ ] Find your user document
- [ ] Change `role` from `"user"` to `"admin"`
- [ ] Save changes
- [ ] Logout and login again
- [ ] Verify: "Admin Panel" link appears in navbar

---

## 🔔 Notification Setup

- [ ] Login to the app
- [ ] Browser shows notification permission request
- [ ] Click "Allow"
- [ ] Verify: Permission granted (check browser settings if needed)

---

## 🎯 Feature Testing

### User Features
- [ ] View contests on dashboard
- [ ] Use "Today" filter
- [ ] Use "This Week" filter
- [ ] Use "All" filter
- [ ] Use platform dropdown filter
- [ ] Click "Go to Contest" button (opens new tab)
- [ ] Click "Remind Me" button
- [ ] Verify: Button changes to "✓ Reminder Set"

### Admin Features (requires admin role)
- [ ] Click "Admin Panel" in navbar
- [ ] Click "Add Contest" button
- [ ] Fill in all contest fields
- [ ] Click "Create" button
- [ ] Verify: Contest appears in table
- [ ] Click "Edit" on a contest
- [ ] Modify details
- [ ] Click "Update"
- [ ] Verify: Changes saved
- [ ] Click "Complete" on a contest
- [ ] Verify: Status changes to "Completed"
- [ ] Click "Delete" on a contest
- [ ] Confirm deletion
- [ ] Verify: Contest removed

### Notification Testing
- [ ] Add contest starting in exactly 60 minutes
- [ ] Set reminder for that contest
- [ ] Wait 1-2 minutes
- [ ] Check backend console for "Checking for reminders..."
- [ ] Wait for notification (should appear around 58-62 min mark)
- [ ] Click notification
- [ ] Verify: Opens contest link

---

## 🐛 Troubleshooting Checklist

### If Backend Won't Start
- [ ] Check if MongoDB is running: `net start MongoDB`
- [ ] Verify `.env` file exists (not `.env.example`)
- [ ] Check `.env` has all required values
- [ ] Check port 5000 is not in use
- [ ] Try `npm install` again
- [ ] Check Node.js version: `node --version`

### If Frontend Won't Start
- [ ] Check backend is running first
- [ ] Check port 3000 is not in use
- [ ] Try `npm install` again
- [ ] Clear node_modules and reinstall
- [ ] Check for error messages in terminal

### If MongoDB Connection Fails
- [ ] Verify MongoDB service is running
- [ ] Check MONGODB_URI in `.env`
- [ ] For Atlas: verify IP whitelist
- [ ] For Atlas: verify credentials
- [ ] Test connection string separately

### If Notifications Don't Work
- [ ] Check browser notification permissions
- [ ] Verify VAPID keys are set in `.env`
- [ ] Check browser console for errors (F12)
- [ ] Try in Chrome or Edge
- [ ] Verify contest time is exactly 60 min from now
- [ ] Check backend logs for "Checking for reminders..."
- [ ] Ensure you clicked "Allow" for notifications

### If Admin Panel Not Visible
- [ ] Verify user role is "admin" in database
- [ ] Logout and login again
- [ ] Clear browser cache
- [ ] Check browser console for errors

---

## 📊 Verification Tests

### Backend Tests
```bash
# Test server health
curl http://localhost:5000/api/health

# Expected: {"status":"OK","message":"Server is running"}
```

### Database Tests
```bash
# Open MongoDB Shell
mongo contest-reminder

# Check collections
show collections

# Expected: contests, reminders, users

# Count users
db.users.count()

# Expected: 1 or more
```

### Frontend Tests
- [ ] Open http://localhost:3000
- [ ] Check browser console (F12) - no errors
- [ ] Check Network tab - API calls succeed
- [ ] Resize browser window - responsive design works
- [ ] Try on mobile device or mobile view

---

## 🎓 College Project Checklist

### Documentation
- [ ] README.md reviewed
- [ ] All .md files present
- [ ] Screenshots taken
- [ ] Architecture diagram available
- [ ] Database schema documented

### Code Quality
- [ ] Code is properly commented
- [ ] Files are organized
- [ ] No console.log() in production code
- [ ] Error handling implemented
- [ ] Security measures in place

### Presentation
- [ ] Demo prepared
- [ ] Talking points ready
- [ ] Features list ready
- [ ] Tech stack explanation ready
- [ ] Q&A preparation done

### Submission
- [ ] All files included
- [ ] .env not included (security)
- [ ] node_modules not included
- [ ] .gitignore present
- [ ] README with setup instructions
- [ ] Working demo video (optional)

---

## 🚀 Quick Commands Reference

### Start Application
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Or use batch file (Windows)
```bash
# Double-click start.bat
```

### Initialize Database
```bash
cd backend
npm run init-db
```

### Generate VAPID Keys
```bash
cd backend
npx web-push generate-vapid-keys
```

### Check MongoDB
```bash
net start MongoDB
```

---

## 📝 Important URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health
- **MongoDB (local):** mongodb://localhost:27017
- **MongoDB Compass:** mongodb://localhost:27017

---

## 🎯 Success Indicators

You know everything is working when:

✅ Both servers running without errors  
✅ Can login/register users  
✅ Contests visible on dashboard  
✅ Filters work correctly  
✅ Admin panel accessible (for admin users)  
✅ Can add/edit/delete contests  
✅ Reminder button works  
✅ Notifications arrive on time  
✅ No errors in console  
✅ Responsive design works  

---

## 📞 Quick Troubleshooting

**Problem:** Port already in use
**Quick Fix:** Change port in config files or close other applications

**Problem:** MongoDB not connected
**Quick Fix:** `net start MongoDB`

**Problem:** No notifications
**Quick Fix:** Check browser permissions and allow notifications

**Problem:** Can't login
**Quick Fix:** Clear browser cache and try again

**Problem:** Admin panel not showing
**Quick Fix:** Change user role to "admin" in database

---

## ✨ Final Check

Before considering the setup complete:

1. ✅ Both servers running
2. ✅ Can access frontend
3. ✅ Can login/register
4. ✅ Contests displayed
5. ✅ Can set reminder
6. ✅ Notifications work
7. ✅ (Admin) Can manage contests
8. ✅ No console errors
9. ✅ MongoDB connected
10. ✅ All features tested

---

**If all checkboxes are checked, congratulations! Your app is ready! 🎉**

---

## 📚 Need More Help?

- 📖 Read [INSTALLATION.md](INSTALLATION.md) for detailed guide
- 📖 Check [SETUP.md](SETUP.md) for quick setup
- 📖 Review [PROJECT_DOCS.md](PROJECT_DOCS.md) for technical details
- 📖 See [README.md](README.md) for complete documentation

---

**Last Updated:** December 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅

# 🎯 Contest Reminder Web App

A full-stack web application that helps competitive programmers never miss coding contests! Get timely reminders 1 hour and 30 minutes before contests through browser notifications.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 👥 User Features
- 📋 **Contest Dashboard** - View all upcoming contests from multiple platforms
- 🔍 **Smart Filters** - Filter by today, this week, or specific platforms
- 🔔 **Browser Notifications** - Get push notifications before contests start
- ⏰ **Dual Reminders** - Automatic reminders 1 hour and 30 minutes before
- 🎨 **Beautiful UI** - Clean, modern interface with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based login/registration system

### 👨‍💼 Admin Features
- ➕ **Add Contests** - Create new contest entries
- ✏️ **Edit Contests** - Update contest details
- ❌ **Delete Contests** - Remove contests
- ✅ **Mark Complete** - Mark contests as finished
- 📊 **Dashboard** - Manage all contests in one place

## 🛠 Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **React Toastify** - Toast notifications
- **Web Push API** - Browser notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Task scheduler
- **web-push** - Push notification library

## 📦 Project Structure

```
Contest Reminder Web app/
├── backend/
│   ├── models/
│   │   ├── Contest.js
│   │   ├── User.js
│   │   └── Reminder.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── contests.js
│   │   └── reminders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── scheduler.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── notifications.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── sw.js
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
cd "Contest Reminder Web app"
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Generate VAPID keys for push notifications
npx web-push generate-vapid-keys

# Copy the output and update .env file
```

**Configure .env file:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/contest-reminder
JWT_SECRET=your_super_secret_jwt_key_change_this
VAPID_PUBLIC_KEY=your_vapid_public_key_here
VAPID_PRIVATE_KEY=your_vapid_private_key_here
VAPID_SUBJECT=mailto:your-email@example.com
```

**Start the backend server:**
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

#### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 🗄 Database Setup

#### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Database will be created automatically

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 👨‍💼 Create Admin User

After starting the application:

1. Register a new account through the UI
2. Connect to MongoDB:
   ```bash
   mongo contest-reminder
   # or for MongoDB Atlas, use MongoDB Compass
   ```
3. Update user role to admin:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 📱 Enabling Browser Notifications

### For Users:
1. Sign in to the application
2. Browser will prompt for notification permission
3. Click "Allow"
4. Set reminders for contests
5. Leave the site - you'll still get notifications!

### Testing Notifications:
1. Add a contest with start time 1 hour from now
2. Set a reminder
3. Wait for notification (cron runs every minute)

## 🎯 Usage Guide

### Adding a Contest (Admin)
1. Login with admin account
2. Go to Admin Panel
3. Click "Add Contest"
4. Fill in details:
   - Contest Name
   - Platform (Codeforces, CodeChef, etc.)
   - Start Time
   - Duration
   - Contest Link
   - Tags (optional)
5. Click "Create"

### Setting Reminders (User)
1. Browse contests on Dashboard
2. Use filters to find contests
3. Click "Remind Me" button
4. Notifications will be sent automatically

### Notification Schedule
- ⏰ **1 hour before** contest starts
- ⏰ **30 minutes before** contest starts

## 🔧 Configuration

### Supported Platforms
- Codeforces
- CodeChef
- LeetCode
- AtCoder
- HackerRank
- HackerEarth
- TopCoder
- Other

### Filters Available
- **Today** - Contests starting today
- **This Week** - Contests in next 7 days
- **All** - All upcoming contests
- **Platform-wise** - Filter by specific platform

## 🧪 API Endpoints

### Authentication
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
GET  /api/auth/me          - Get current user
PATCH /api/auth/me         - Update profile
POST /api/auth/subscription - Save push subscription
```

### Contests
```
GET    /api/contests          - Get all contests (with filters)
GET    /api/contests/:id      - Get single contest
POST   /api/contests          - Create contest (Admin)
PATCH  /api/contests/:id      - Update contest (Admin)
DELETE /api/contests/:id      - Delete contest (Admin)
PATCH  /api/contests/:id/complete - Mark completed (Admin)
```

### Reminders
```
GET    /api/reminders     - Get user's reminders
POST   /api/reminders     - Create reminder
DELETE /api/reminders/:id - Delete reminder
```

## 🔒 Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Protected routes (middleware)
- Admin-only routes
- CORS enabled
- Input validation

## 🎨 UI Features
- Responsive design (mobile-friendly)
- Dark mode ready structure
- Toast notifications
- Loading states
- Error handling
- Beautiful gradient backgrounds
- Platform-specific color coding

## 🚀 Deployment

### Backend Deployment (Render, Heroku, etc.)
1. Push code to GitHub
2. Connect to hosting platform
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel, Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Important: Update API URL
In production, update frontend API URL:
```javascript
// frontend/src/services/api.js
const API_URL = 'https://your-backend-url.com/api';
```

## 🐛 Troubleshooting

### Notifications not working?
1. Check browser notification permissions
2. Verify VAPID keys are set in .env
3. Ensure HTTPS (required for service workers in production)
4. Check browser console for errors

### Can't connect to MongoDB?
1. Verify MongoDB is running
2. Check connection string in .env
3. Ensure IP is whitelisted (if using Atlas)

### Cron job not running?
1. Check server logs
2. Verify contests exist in database
3. Ensure contest times are in future

## 📝 Future Enhancements
- 📲 WhatsApp notifications (Twilio API)
- 🌙 Dark mode toggle
- ⭐ Favorite platforms
- 📅 Google Calendar integration
- 🔎 Search functionality
- 📱 PWA support (installable app)
- 🌍 Multiple timezones support
- 📊 Contest statistics
- 🏆 Rating tracking

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Created as a college project to help competitive programmers stay on top of their contest schedule.

## 🙏 Acknowledgments
- Contest data can be fetched from Clist API (future enhancement)
- Icons and emojis from Unicode
- Inspiration from competitive programming community

## 📞 Support
For issues or questions, please open an issue on GitHub.

---

**Happy Coding! May you never miss a contest again! 🚀**

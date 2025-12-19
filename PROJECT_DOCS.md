# 🎓 Project Documentation

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features Breakdown](#features-breakdown)
4. [Database Schema](#database-schema)
5. [API Documentation](#api-documentation)
6. [Notification System](#notification-system)
7. [Security](#security)
8. [Testing](#testing)

---

## 🎯 Project Overview

**Contest Reminder Web App** is a full-stack MERN application designed to help competitive programmers stay updated with upcoming coding contests across multiple platforms.

### Key Highlights
- Real-time browser notifications
- Automated reminder scheduler
- Admin panel for contest management
- Responsive design
- JWT authentication
- RESTful API architecture

---

## 🏗 Architecture

### System Architecture
```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   (Express)     │
│   Port: 5000    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│MongoDB│  │Cron   │
│       │  │Jobs   │
└───────┘  └───────┘
```

### Technology Stack

#### Frontend
- **React 18** - Component-based UI
- **Vite** - Build tool (faster than CRA)
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client routing
- **Axios** - HTTP client
- **Context API** - State management

#### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **node-cron** - Task scheduling
- **web-push** - Push notifications

---

## ✨ Features Breakdown

### 1. Authentication System
**Files:**
- `backend/routes/auth.js`
- `backend/middleware/auth.js`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/Auth.jsx`

**Features:**
- User registration with validation
- Secure login with JWT
- Password hashing (bcrypt)
- Token-based authentication
- Protected routes
- Role-based access (user/admin)

### 2. Contest Management
**Files:**
- `backend/routes/contests.js`
- `backend/models/Contest.js`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/AdminPanel.jsx`

**Features:**
- CRUD operations (admin)
- Contest filters (today/week/platform)
- Real-time updates
- Contest status tracking
- Platform categorization

### 3. Reminder System
**Files:**
- `backend/routes/reminders.js`
- `backend/models/Reminder.js`
- `backend/utils/scheduler.js`

**Features:**
- Set reminders for contests
- Dual notifications (1hr, 30min)
- Cron-based scheduler
- Automatic notification delivery
- Reminder status tracking

### 4. Notification System
**Files:**
- `frontend/src/services/notifications.js`
- `frontend/public/sw.js`

**Features:**
- Browser push notifications
- Service Worker registration
- VAPID authentication
- Notification click handling
- Background notifications

---

## 🗄 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (enum: ['user', 'admin']),
  whatsapp: String,
  notificationPermission: Boolean,
  pushSubscription: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Contest Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  platform: String (enum, required),
  startTime: Date (required),
  duration: String (required),
  link: String (required),
  tags: [String],
  isCompleted: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Reminder Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  contestId: ObjectId (ref: Contest, required),
  remindAt: [String] (['1hr', '30min']),
  sent: {
    '1hr': Boolean,
    '30min': Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- **User:** email (unique)
- **Contest:** startTime + isCompleted
- **Reminder:** userId + contestId (compound unique)

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201
{
  "user": {
    "id": "...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200
{
  "user": { ... }
}
```

### Contest Endpoints

#### Get All Contests
```http
GET /contests?timeFilter=week&platform=Codeforces

Response: 200
[
  {
    "_id": "...",
    "name": "Contest Name",
    "platform": "Codeforces",
    "startTime": "2025-01-20T18:30:00",
    "duration": "2 hours",
    "link": "https://...",
    "tags": ["Div 2"],
    "isCompleted": false
  }
]
```

#### Create Contest (Admin)
```http
POST /contests
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "New Contest",
  "platform": "Codeforces",
  "startTime": "2025-01-20T18:30:00",
  "duration": "2 hours",
  "link": "https://...",
  "tags": ["Div 2"]
}

Response: 201
```

### Reminder Endpoints

#### Create Reminder
```http
POST /reminders
Authorization: Bearer <token>
Content-Type: application/json

{
  "contestId": "contest_id_here",
  "remindAt": ["1hr", "30min"]
}

Response: 201
```

---

## 🔔 Notification System

### How It Works

1. **Service Worker Registration**
   - Registers on app load
   - Handles push events
   - Shows notifications

2. **Push Subscription**
   - User grants permission
   - Subscription created
   - Stored in database

3. **VAPID Keys**
   - Public/Private key pair
   - Authenticates push messages
   - Generated using web-push

4. **Scheduler (Cron Job)**
   ```javascript
   // Runs every minute
   cron.schedule('* * * * *', () => {
     checkAndSendReminders();
   });
   ```

5. **Notification Logic**
   ```
   For each contest:
     Calculate time until start
     If 58-62 minutes: Send 1hr reminder
     If 28-32 minutes: Send 30min reminder
     Mark as sent in database
   ```

### Notification Payload
```javascript
{
  title: '🚨 Contest Reminder',
  body: 'Contest starts in 1 hour!',
  icon: '/logo.png',
  badge: '/badge.png',
  data: {
    url: 'contest_link',
    contestId: 'id'
  }
}
```

---

## 🔒 Security

### Implemented Security Features

1. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Never stored in plain text
   - Compared using bcrypt.compare()

2. **JWT Authentication**
   - Signed tokens
   - 7-day expiration
   - Stored in localStorage
   - Sent in Authorization header

3. **Protected Routes**
   - Middleware authentication
   - Admin-only endpoints
   - Token verification

4. **Input Validation**
   - Required field validation
   - Email format validation
   - Password length requirements

5. **CORS**
   - Cross-Origin Resource Sharing
   - Configured for frontend URL

6. **MongoDB Security**
   - Schema validation
   - Unique constraints
   - Index optimization

### Best Practices
- Use HTTPS in production
- Store secrets in .env
- Never commit .env to git
- Regularly update dependencies
- Use helmet.js in production

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials
- [ ] Access protected route without token
- [ ] Token expiration handling

#### Contests (User)
- [ ] View all contests
- [ ] Filter by today
- [ ] Filter by week
- [ ] Filter by platform
- [ ] Click contest link

#### Contests (Admin)
- [ ] Create new contest
- [ ] Edit existing contest
- [ ] Delete contest
- [ ] Mark as completed

#### Reminders
- [ ] Set reminder for contest
- [ ] View my reminders
- [ ] Delete reminder
- [ ] Receive 1hr notification
- [ ] Receive 30min notification

#### UI/UX
- [ ] Responsive on mobile
- [ ] Toast notifications work
- [ ] Loading states display
- [ ] Error handling works

### Testing Notifications

1. **Setup Test Contest:**
   ```
   Start Time: Current time + 60 minutes
   Set reminder
   ```

2. **Monitor Backend Console:**
   ```
   Should see:
   "Checking for reminders..."
   "Notification sent to user@example.com"
   ```

3. **Check Browser:**
   - Notification should appear
   - Click should open contest link

---

## 📊 Performance Considerations

### Backend Optimization
- Database indexing
- Efficient queries with filters
- Pagination (future)
- Caching (future)

### Frontend Optimization
- Lazy loading routes
- Memoization (future)
- Code splitting
- Image optimization

### Database Optimization
- Compound indexes
- Query optimization
- Connection pooling

---

## 🚀 Future Enhancements

### Phase 1 (Easy)
- [ ] Dark mode toggle
- [ ] Search contests
- [ ] Favorite platforms
- [ ] Email notifications
- [ ] Contest countdown timer

### Phase 2 (Medium)
- [ ] Google Calendar sync
- [ ] PWA support
- [ ] Contest statistics
- [ ] User dashboard
- [ ] Contest history

### Phase 3 (Advanced)
- [ ] WhatsApp notifications (Twilio)
- [ ] Auto-fetch from Clist API
- [ ] Rating tracker
- [ ] Contest recommendations
- [ ] Social features (friends)

---

## 📝 File Structure Reference

```
Contest Reminder Web app/
│
├── backend/
│   ├── models/
│   │   ├── Contest.js       # Contest schema
│   │   ├── User.js          # User schema
│   │   └── Reminder.js      # Reminder schema
│   │
│   ├── routes/
│   │   ├── auth.js          # Auth endpoints
│   │   ├── contests.js      # Contest CRUD
│   │   └── reminders.js     # Reminder endpoints
│   │
│   ├── middleware/
│   │   └── auth.js          # JWT verification
│   │
│   ├── utils/
│   │   └── scheduler.js     # Cron jobs
│   │
│   ├── server.js            # Entry point
│   ├── init-db.js           # DB seeder
│   ├── package.json         # Dependencies
│   └── .env                 # Environment vars
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminPanel.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── notifications.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   │   └── sw.js            # Service Worker
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── README.md
├── SETUP.md
├── SAMPLE_DATA.md
└── start.bat
```

---

## 💡 Tips & Tricks

### Development
1. Use `npm run dev` for both servers
2. Check browser console for errors
3. Monitor backend logs
4. Use MongoDB Compass for DB viewing
5. Test in Chrome/Edge for best compatibility

### Debugging
1. Check if MongoDB is running
2. Verify .env configuration
3. Check VAPID keys are set
4. Ensure ports are available
5. Clear browser cache if needed

### Production
1. Use environment-specific configs
2. Enable HTTPS
3. Use MongoDB Atlas
4. Set up monitoring
5. Regular backups

---

**Happy Coding! 🚀**

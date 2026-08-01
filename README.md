# HackVerse — Hackathon Management Platform

A full-stack **MERN** web application for organizing, managing, participating in, and evaluating hackathons through four distinct user roles.

---

## 🌐 Live Demo & Deployment

- **Frontend App**: [https://hackverse-app.vercel.app](https://hackverse-app.vercel.app) ✅ Live
- **Backend API**: [https://hackverse-api.vercel.app](https://hackverse-api.vercel.app) ✅ Live
- **API Health Check**: [https://hackverse-api.vercel.app/api/health](https://hackverse-api.vercel.app/api/health)

### 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@hackverse.io` | `Admin123!` |
| **Organizer** | `organizer@hackverse.io` | `Organizer123!` |
| **Participant** | `participant@hackverse.io` | `Participant123!` |
| **Judge** | `judge@hackverse.io` | `Judge123!` |

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite, React Router v6, Tailwind CSS v4, Axios |
| State | React Context API |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |

---

## 📁 Project Structure

```
HackVerse/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── context/       # AuthContext
│       ├── layouts/       # MainLayout
│       ├── pages/         # All pages + dashboards
│       └── services/      # Axios API calls
└── server/          # Express backend
    ├── config/      # MongoDB connection
    ├── controllers/ # Business logic
    ├── middleware/  # Auth, error handler
    ├── models/      # Mongoose schemas
    └── routes/      # Express routes
```

---

## 👥 User Roles

| Role | Key Abilities |
|------|--------------|
| **Admin** | Full platform control — manage all users (block/unblock/delete), view all data |
| **Organizer** | Create/manage hackathons, approve registrations, assign judges, announce winners |
| **Participant** | Register, create/join teams, submit projects |
| **Judge** | Score submissions with 7 predefined criteria, write feedback |

---

## 🗄️ Database Collections

- **Users** — with bcrypt password hashing, role-based access
- **Hackathons** — full details, status lifecycle, judges
- **Teams** — leader, members, max size enforcement
- **Registrations** — per-participant per-hackathon, approval flow
- **Submissions** — project details, links, files, status
- **Reviews** — per-judge per-submission, auto-computed total score

---

## 🚢 Deploy to Production

Both services are deployed on **Vercel** (free tier):

| Service | URL |
|---------|-----|
| Frontend | https://hackverse-app.vercel.app |
| Backend API | https://hackverse-api.vercel.app |

### Redeploy
```bash
# Frontend
cd client && npx vercel --prod --yes

# Backend
cd server && npx vercel --prod --yes
```

---

## ⚙️ Setup & Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local at `localhost:27017` or Atlas)

### Backend
```bash
cd server
npm install
# Edit .env if needed (MongoDB URI, JWT secret)
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔗 API Endpoints

| Route | Method | Access |
|-------|--------|--------|
| `/api/auth/signup` | POST | Public |
| `/api/auth/login` | POST | Public |
| `/api/auth/me` | GET | Authenticated |
| `/api/hackathons` | GET | Public |
| `/api/hackathons` | POST | Organizer |
| `/api/hackathons/:id` | PUT/DELETE | Organizer (own) |
| `/api/registrations` | POST | Participant |
| `/api/registrations/:id/status` | PUT | Organizer |
| `/api/teams` | POST | Participant |
| `/api/submissions` | POST | Participant |
| `/api/reviews` | POST | Judge |
| `/api/leaderboard/:hackathonId` | GET | Public |
| `/api/dashboard/admin` | GET | Admin |
| `/api/dashboard/organizer` | GET | Organizer |
| `/api/dashboard/participant` | GET | Participant |
| `/api/dashboard/judge` | GET | Judge |
| `/api/users` | GET/PUT/DELETE | Admin |

---

## 🌟 Features

### Core
- ✅ JWT Authentication with bcrypt password hashing
- ✅ Role-based authorization (Admin / Organizer / Participant / Judge)
- ✅ Protected routes on frontend
- ✅ Full hackathon CRUD with search & filters (mode, status, theme)
- ✅ Registration flow with approval/rejection
- ✅ Team management (create, invite by email, remove, transfer leadership)
- ✅ Project submission with deadline enforcement
- ✅ Judge evaluation with 7-criteria scoring rubric
- ✅ Leaderboard ranked by average review score
- ✅ Role-specific dashboards for all 4 roles
- ✅ File uploads (banner images, screenshots, presentation PDFs)

### UI/UX
- ✅ Dark glassmorphism design
- ✅ Responsive layout (mobile + desktop)
- ✅ Toast notifications
- ✅ Loading states & empty states
- ✅ Animated hero section
- ✅ Pagination on hackathon listing
- ✅ Interactive judging sliders

---

## 📋 Environment Variables (server/.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hackverse
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

# HackVerse — Hackathon Management Platform

A full-stack **MERN** web application for organizing, managing, participating in, and evaluating hackathons through four distinct user roles.

---

## 🌐 Live Demo & Deployment

- **Frontend App**: [https://hackverse-app.vercel.app](https://hackverse-app.vercel.app) 
- **Backend API**: [https://hackverse-1vym.onrender.com](https://hackverse-1vym.onrender.com) 
- **API Health Check**: [https://hackverse-1vym.onrender.com/api/health](https://hackverse-1vym.onrender.com/api/health)

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
| Frontend | React 18 + Vite, React Router v6, Vanilla CSS, Axios |
| State | React Context API |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |

---

## 📁 Project Structure

```
HackVerse/
├── client/                  # React frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       │   └── common/      # Navbar, Footer, Loader, RouteGuards
│       ├── context/         # AuthContext (global auth state)
│       ├── layouts/         # MainLayout wrapper
│       ├── pages/           # All pages + role dashboards
│       └── services/        # Axios API service layer
├── server/                  # Node.js + Express backend
│   ├── config/              # MongoDB connection (db.js)
│   ├── controllers/         # Business logic per resource
│   ├── middleware/          # auth.js, errorHandler.js
│   ├── models/              # Mongoose schemas (6 models)
│   ├── routes/              # Express routers (9 route files)
│   ├── utils/               # generateToken.js
│   └── server.js            # App entry point
├── project_report.md        # Full project report
├── db_schema.md             # Database schema documentation
├── api_documentation.md     # REST API documentation
└── README.md
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

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [project_report.md](./project_report.md) | Full project report — architecture, features, tech stack, deployment |
| [db_schema.md](./db_schema.md) | MongoDB schema for all 6 collections with field types and indexes |
| [api_documentation.md](./api_documentation.md) | REST API reference — all 45+ endpoints with request/response examples |

---

## 🚢 Deploy to Production

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://hackverse-app.vercel.app |
| Backend API | Render | https://hackverse-1vym.onrender.com |

### Redeploy Frontend
```bash
cd client && npx vercel --prod --force
```

### Redeploy Backend
Push to `main` — Render auto-deploys on every push.

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

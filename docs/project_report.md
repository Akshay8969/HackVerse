# HackVerse — Project Report

## 1. Project Overview

**HackVerse** is a full-stack hackathon management platform that enables organizers to create and manage hackathons, participants to register and submit projects, and judges to review and score submissions — all in one place.

| | |
|--|--|
| **Live Frontend** | https://hackverse-app.vercel.app |
| **Live Backend** | https://hackverse-1vym.onrender.com |
| **GitHub** | https://github.com/Akshay8969/HackVerse |
| **Stack** | React + Vite · Node.js + Express · MongoDB Atlas |

---

## 2. Problem Statement

Hackathon management today is fragmented — organizers use Google Forms for registration, spreadsheets for scoring, and email for communication. There is no unified platform that handles the complete lifecycle of a hackathon event.

**HackVerse** solves this by providing:
- End-to-end hackathon lifecycle management
- Role-based access for organizers, participants, and judges
- Real-time leaderboards and scoring
- Team formation and collaboration tools

---

## 3. Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| Lucide React | Icon library |
| Vanilla CSS | Custom styling with glassmorphism design |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Multer | File uploads |
| CORS | Cross-origin request handling |

### Infrastructure
| Service | Role |
|---------|------|
| Vercel | Frontend hosting (SPA) |
| Render | Backend hosting (Node.js server) |
| MongoDB Atlas | Cloud database |
| GitHub | Version control & CI |

---

## 4. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Vercel)                        │
│   React SPA → React Router → Axios → API Service Layer   │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTPS (REST API)
                          │ Origin: hackverse-app.vercel.app
┌─────────────────────────▼────────────────────────────────┐
│                   SERVER (Render)                         │
│   Express 5 → CORS → JWT Auth → Controllers → Mongoose   │
└─────────────────────────┬────────────────────────────────┘
                          │ mongoose driver (TLS)
┌─────────────────────────▼────────────────────────────────┐
│                MongoDB Atlas (Cloud)                      │
│   Collections: users, hackathons, teams, registrations,  │
│                submissions, reviews                       │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Features

### Authentication & Users
- JWT-based authentication with 7-day token expiry
- Role-based access control: `admin`, `organizer`, `participant`, `judge`
- Profile management (bio, skills, GitHub/LinkedIn links, avatar)
- Password change with bcrypt verification

### Hackathon Management (Organizers)
- Create/edit/delete hackathons with banner image upload
- Set registration deadlines, team size limits, prize pool, rules
- Assign judges to specific hackathons
- Toggle registration open/closed
- Define custom judging criteria
- Announce winners after judging completes

### Participant Features
- Browse and search public hackathons
- Register for hackathons
- Create/join teams with invite system
- Submit projects (GitHub link, live demo, screenshots, PDF, video)
- View personal dashboard with registered hackathons & submissions

### Judging System
- Judges see assigned hackathons only
- Score submissions on 7 criteria (Innovation, Technical Complexity, UI/UX, Functionality, Scalability, Documentation, Presentation)
- Auto-calculated total score (max 70)
- Comment on submissions

### Leaderboard
- Real-time leaderboard per hackathon
- Sorted by total judge scores
- Visible after winners announcement

### Admin Panel
- View all users, block/unblock accounts
- Full access to all hackathons and submissions

---

## 6. API Design

The REST API follows standard conventions:
- Base URL: `https://hackverse-1vym.onrender.com/api`
- Auth: Bearer token in `Authorization` header
- Responses: `{ success: true/false, data/message }`
- Routes: `/auth`, `/hackathons`, `/teams`, `/registrations`, `/submissions`, `/reviews`, `/dashboard`, `/leaderboard`, `/users`

---

## 7. Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens signed with environment secret
- Protected routes use `protect` middleware (token verification)
- Role-based route guards via `authorize()` middleware
- CORS restricted to `https://hackverse-app.vercel.app`
- Environment variables stored in Vercel/Render (never committed)
- `.env` files excluded via `.gitignore`

---

## 8. Database Design

Six MongoDB collections with Mongoose schemas:
`users` · `hackathons` · `teams` · `registrations` · `submissions` · `reviews`

See **DB Schema Documentation** for full field-level detail.

---

## 9. Deployment Pipeline

```
Local Dev  →  git push  →  GitHub (main)
                                │
               ┌────────────────┴────────────────┐
               ▼                                  ▼
          Vercel CLI                         Render
    (npx vercel --prod --force)        (auto-deploy on push)
          client/ dir                      server/ dir
          Vite build                       npm start
```

---

## 10. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hackverse.io | Admin@123 |
| Organizer | organizer@hackverse.io | Organizer@123 |
| Judge | judge@hackverse.io | Judge@123 |
| Participant | participant@hackverse.io | Participant@123 |

---

## 11. Known Limitations

- File uploads (avatars, screenshots, PDFs) are stored on Render's ephemeral filesystem — files reset on redeploy. For production, migrate to Cloudinary or AWS S3.
- Render free tier spins down after 15 minutes of inactivity (cold start ~30s).
- No email notification system (invites are in-app only).
- No real-time WebSocket support (leaderboard requires page refresh).

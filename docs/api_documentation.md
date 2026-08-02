# HackVerse — API Documentation

**Base URL**: `https://hackverse-1vym.onrender.com/api`  
**Format**: JSON  
**Auth**: Bearer token — `Authorization: Bearer <token>`

---

## Authentication

### POST `/auth/signup`
Register a new user.

**Access**: Public  
**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "participant"
}
```
**Response** `201`:
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "John Doe", "email": "...", "role": "participant", "avatar": "" }
}
```

---

### POST `/auth/login`
Login with credentials.

**Access**: Public  
**Body**:
```json
{ "email": "john@example.com", "password": "password123" }
```
**Response** `200`:
```json
{ "success": true, "token": "eyJhbGci...", "user": { ... } }
```

---

### GET `/auth/me`
Get current logged-in user.

**Access**: 🔒 Any authenticated user  
**Response** `200`:
```json
{ "success": true, "user": { "_id": "...", "name": "...", "role": "...", ... } }
```

---

### PUT `/auth/profile`
Update profile (name, bio, skills, github, linkedin, avatar).

**Access**: 🔒 Any authenticated user  
**Body**: `multipart/form-data`  
| Field | Type |
|-------|------|
| `name` | string |
| `bio` | string |
| `skills` | string (comma-separated) |
| `github` | string |
| `linkedin` | string |
| `avatar` | file (image) |

---

### PUT `/auth/change-password`
Change password.

**Access**: 🔒 Any authenticated user  
**Body**: `{ "currentPassword": "...", "newPassword": "..." }`

---

## Hackathons

### GET `/hackathons`
Get all public hackathons. Supports query params: `?search=ai&status=Ongoing&mode=Online`

**Access**: Public  
**Response** `200`:
```json
{ "success": true, "count": 5, "hackathons": [ { ... } ] }
```

---

### GET `/hackathons/:id`
Get single hackathon by ID.

**Access**: Public

---

### GET `/hackathons/my`
Get hackathons created by the logged-in organizer.

**Access**: 🔒 `organizer`, `admin`

---

### POST `/hackathons`
Create a new hackathon.

**Access**: 🔒 `organizer`, `admin`  
**Body**: `multipart/form-data`  
| Field | Type | Required |
|-------|------|----------|
| `title` | string | ✅ |
| `description` | string | ✅ |
| `theme` | string | ✅ |
| `mode` | `Online\|Offline\|Hybrid` | ✅ |
| `startDate` | ISO date | ✅ |
| `endDate` | ISO date | ✅ |
| `registrationDeadline` | ISO date | ✅ |
| `prizePool` | string | — |
| `maxTeamSize` | number | — |
| `rules` | string | — |
| `tags` | string | — |
| `bannerImage` | file | — |

---

### PUT `/hackathons/:id`
Update a hackathon.

**Access**: 🔒 `organizer` (owner), `admin`

---

### DELETE `/hackathons/:id`
Delete a hackathon.

**Access**: 🔒 `organizer` (owner), `admin`

---

### PUT `/hackathons/:id/registration`
Toggle registration open/closed.

**Access**: 🔒 `organizer`, `admin`  
**Body**: `{ "registrationOpen": true }`

---

### PUT `/hackathons/:id/judges`
Assign judges to hackathon.

**Access**: 🔒 `organizer`, `admin`  
**Body**: `{ "judges": ["userId1", "userId2"] }`

---

### PUT `/hackathons/:id/announce-winners`
Announce winners (finalizes leaderboard).

**Access**: 🔒 `organizer`, `admin`

---

## Teams

### POST `/teams`
Create a new team for a hackathon.

**Access**: 🔒 `participant`  
**Body**: `{ "name": "Team Alpha", "hackathonId": "..." }`

---

### GET `/teams/my/:hackathonId`
Get logged-in user's team for a specific hackathon.

**Access**: 🔒 `participant`

---

### GET `/teams/hackathon/:hackathonId`
Get all teams for a hackathon.

**Access**: 🔒 `organizer`, `admin`

---

### GET `/teams/:id`
Get team details by ID.

**Access**: 🔒 Any authenticated user

---

### POST `/teams/:id/members`
Add a member to team (by email invite).

**Access**: 🔒 `participant` (team leader only)  
**Body**: `{ "email": "member@example.com" }`

---

### DELETE `/teams/:id/members/:memberId`
Remove a member from team.

**Access**: 🔒 `participant` (team leader only)

---

### PUT `/teams/:id/transfer-leadership`
Transfer team leadership.

**Access**: 🔒 `participant` (current leader)  
**Body**: `{ "newLeaderId": "..." }`

---

### DELETE `/teams/:id`
Delete a team.

**Access**: 🔒 `participant` (team leader), `admin`

---

## Registrations

### POST `/registrations`
Register for a hackathon.

**Access**: 🔒 `participant`  
**Body**: `{ "hackathonId": "..." }`

---

### GET `/registrations/my`
Get all hackathons the user has registered for.

**Access**: 🔒 `participant`

---

### GET `/registrations/hackathon/:hackathonId`
Get all registrations for a hackathon.

**Access**: 🔒 `organizer`, `admin`

---

### PUT `/registrations/:id/status`
Approve or reject a registration.

**Access**: 🔒 `organizer`, `admin`  
**Body**: `{ "status": "approved" }`

---

## Submissions

### POST `/submissions`
Submit a project.

**Access**: 🔒 `participant`  
**Body**: `multipart/form-data`
| Field | Type | Required |
|-------|------|----------|
| `hackathonId` | string | ✅ |
| `teamId` | string | ✅ |
| `projectName` | string | ✅ |
| `problemStatement` | string | ✅ |
| `solution` | string | ✅ |
| `techStack` | string | — |
| `githubRepo` | string | — |
| `liveDemoUrl` | string | — |
| `demoVideoLink` | string | — |
| `screenshots` | files (max 5) | — |
| `presentationPdf` | file | — |

---

### GET `/submissions/my/:hackathonId`
Get the logged-in participant's submission for a hackathon.

**Access**: 🔒 `participant`

---

### GET `/submissions/hackathon/:hackathonId`
Get all submissions for a hackathon (for review).

**Access**: 🔒 `organizer`, `admin`, `judge`

---

### GET `/submissions/:id`
Get a single submission by ID.

**Access**: 🔒 Any authenticated user

---

### PUT `/submissions/:id`
Update a submission.

**Access**: 🔒 `participant` (submitter)

---

### PUT `/submissions/:id/status`
Update submission status.

**Access**: 🔒 `organizer`, `admin`  
**Body**: `{ "status": "under_review" }`

---

## Reviews

### POST `/reviews`
Submit a review/score for a submission.

**Access**: 🔒 `judge`  
**Body**:
```json
{
  "submissionId": "...",
  "hackathonId": "...",
  "scores": {
    "innovation": 8,
    "technicalComplexity": 7,
    "userInterface": 9,
    "functionality": 8,
    "scalability": 6,
    "documentation": 7,
    "presentation": 8
  },
  "comments": "Great project!"
}
```

---

### GET `/reviews/submission/:submissionId`
Get all reviews for a submission.

**Access**: 🔒 `organizer`, `admin`, `judge`

---

### GET `/reviews/my/:hackathonId`
Get reviews submitted by the logged-in judge for a hackathon.

**Access**: 🔒 `judge`

---

## Dashboard

### GET `/dashboard`
Get personalized dashboard data for the logged-in user.

**Access**: 🔒 Any authenticated user  
**Response**: Role-specific stats (registered hackathons, teams, submissions, scores)

---

## Leaderboard

### GET `/leaderboard/:hackathonId`
Get scored leaderboard for a hackathon.

**Access**: Public (visible after winners announced)  
**Response**: Ranked list of teams with total scores

---

## Users (Admin)

### GET `/users`
Get all users.

**Access**: 🔒 `admin`

---

### PUT `/users/:id/block`
Block or unblock a user.

**Access**: 🔒 `admin`  
**Body**: `{ "isBlocked": true }`

---

## Error Responses

All errors follow the format:
```json
{ "success": false, "message": "Error description here" }
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad request / validation error |
| `401` | Not authenticated |
| `403` | Forbidden (wrong role) |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Health Check

### GET `/health`
Check if the API is running.

**Access**: Public  
**Response**: `{ "status": "OK", "message": "HackVerse API is running" }`

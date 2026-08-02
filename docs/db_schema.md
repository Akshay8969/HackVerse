# HackVerse — Database Schema Documentation

**Database**: MongoDB Atlas  
**ODM**: Mongoose 8.x  
**Collections**: 6

---

## Entity Relationship Overview

```
User ──────────────────────────────────────────────────────┐
 │ organizer                                                │ judge
 │                                                          │
 ▼                                                          ▼
Hackathon ◄──── Registration ◄──── User (participant)      │
 │                                                          │
 ▼                                                          │
Team ◄──── members[] ◄──── User                            │
 │                                                          │
 ▼                                                          │
Submission ──────────────────────► Review ◄────────────────┘
           submittedBy (User)      judge (User)
```

---

## Collection 1: `users`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | ✅ | max 50 chars |
| `email` | String | ✅ | unique, lowercase, email format |
| `password` | String | ✅ | min 6 chars, select: false (hidden) |
| `role` | String (enum) | — | `admin` \| `organizer` \| `participant` \| `judge`, default: `participant` |
| `avatar` | String | — | File path or URL, default: `""` |
| `bio` | String | — | max 300 chars |
| `skills` | [String] | — | Array of skill tags |
| `github` | String | — | GitHub profile URL |
| `linkedin` | String | — | LinkedIn profile URL |
| `isBlocked` | Boolean | — | default: `false` |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Indexes**: `email` (unique)  
**Hooks**: `pre('save')` — bcrypt hash password if modified

---

## Collection 2: `hackathons`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Primary key |
| `title` | String | ✅ | max 100 chars |
| `description` | String | ✅ | — |
| `theme` | String | ✅ | — |
| `mode` | String (enum) | ✅ | `Online` \| `Offline` \| `Hybrid` |
| `venue` | String | — | default: `""` |
| `startDate` | Date | ✅ | — |
| `endDate` | Date | ✅ | — |
| `registrationDeadline` | Date | ✅ | — |
| `bannerImage` | String | — | File path, default: `""` |
| `prizePool` | String | — | e.g. `"₹50,000"` |
| `maxTeamSize` | Number | — | min: 1, default: 4 |
| `rules` | String | — | Markdown-safe text |
| `judgingCriteria` | [{name, maxScore}] | — | maxScore default: 10 |
| `organizer` | ObjectId → User | ✅ | ref: `User` |
| `judges` | [ObjectId] | — | ref: `User[]` |
| `status` | String (enum) | — | `Draft` \| `Registration Open` \| `Registration Closed` \| `Ongoing` \| `Completed` |
| `registrationOpen` | Boolean | — | default: `false` |
| `winnersAnnounced` | Boolean | — | default: `false` |
| `tags` | [String] | — | Search tags |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Indexes**: Text index on `title`, `description`, `theme` (full-text search)

---

## Collection 3: `teams`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Primary key |
| `name` | String | ✅ | max 60 chars |
| `hackathon` | ObjectId → Hackathon | ✅ | ref: `Hackathon` |
| `leader` | ObjectId → User | ✅ | ref: `User` |
| `members` | [ObjectId] | — | ref: `User[]` |
| `invites` | [{email, status}] | — | status: `pending` \| `accepted` \| `rejected` |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Indexes**: None explicit (compound queries via app logic)

---

## Collection 4: `registrations`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Primary key |
| `hackathon` | ObjectId → Hackathon | ✅ | ref: `Hackathon` |
| `participant` | ObjectId → User | ✅ | ref: `User` |
| `team` | ObjectId → Team | — | ref: `Team`, default: `null` |
| `status` | String (enum) | — | `pending` \| `approved` \| `rejected`, default: `pending` |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Indexes**: Compound unique `{ hackathon: 1, participant: 1 }` — one registration per user per hackathon

---

## Collection 5: `submissions`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Primary key |
| `team` | ObjectId → Team | ✅ | ref: `Team` |
| `hackathon` | ObjectId → Hackathon | ✅ | ref: `Hackathon` |
| `submittedBy` | ObjectId → User | ✅ | ref: `User` |
| `projectName` | String | ✅ | — |
| `problemStatement` | String | ✅ | — |
| `solution` | String | ✅ | — |
| `description` | String | — | Additional details |
| `githubRepo` | String | — | GitHub URL |
| `liveDemoUrl` | String | — | Demo URL |
| `techStack` | [String] | — | Technologies used |
| `screenshots` | [String] | — | File paths (max 5) |
| `presentationPdf` | String | — | File path |
| `demoVideoLink` | String | — | YouTube/Loom URL |
| `status` | String (enum) | — | `pending` \| `under_review` \| `approved` \| `rejected` |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Indexes**: Compound unique `{ team: 1, hackathon: 1 }` — one submission per team per hackathon

---

## Collection 6: `reviews`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | Primary key |
| `submission` | ObjectId → Submission | ✅ | ref: `Submission` |
| `judge` | ObjectId → User | ✅ | ref: `User` |
| `hackathon` | ObjectId → Hackathon | ✅ | ref: `Hackathon` |
| `scores.innovation` | Number | — | 0–10 |
| `scores.technicalComplexity` | Number | — | 0–10 |
| `scores.userInterface` | Number | — | 0–10 |
| `scores.functionality` | Number | — | 0–10 |
| `scores.scalability` | Number | — | 0–10 |
| `scores.documentation` | Number | — | 0–10 |
| `scores.presentation` | Number | — | 0–10 |
| `totalScore` | Number | — | Auto-calculated (max 70) |
| `comments` | String | — | Judge feedback text |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

**Indexes**: Compound unique `{ submission: 1, judge: 1 }` — one review per judge per submission  
**Hooks**: `pre('save')` — auto-calculates `totalScore` as sum of all 7 criteria scores

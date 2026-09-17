# QuestLy (v1) ⚔️

A gamified study tracker and productivity chamber. Create quests, complete them, run focus sessions, and level up — with multiple profiles and a history log of everything you've earned.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)

> 📁 **Legacy Manual Version (v1):** This is the original manual web release using MongoDB Atlas cloud. For the containerized version with local MongoDB and Docker Compose, check out [**QuestLy v2 ➔**](../v2)

---

## 🎮 Features

- **Quests** — log tasks as Easy / Medium / Hard, each worth its own XP (+50 / +100 / +200).
- **Deep Focus Chamber** — a Pomodoro-style timer with selectable session lengths (15 / 25 / 45 / 60 min), earning XP proportional to time focused.
- **Leveling** — XP accumulates toward a level threshold (`level × 100`); crossing it levels you up and rolls over any excess XP.
- **Multiple Profiles** — switch between scholars from a profile picker; your active profile is remembered across sessions.
- **History Log** — every completed quest and finished focus session is logged with a timestamp and XP earned.

### 📸 Demo (v1)

**Profile creation**

![Profile creation](client/public/1.png)

**Main dashboard**

![Main dashboard](client/public/2.png)

**Task Updation**

![Task Updation](client/public/3.png)

**MongoDB Atlas**

![MongoDB Atlas data](client/public/4.png)

---

## 🛠️ Tech Stack (v1)

### Frontend
<p>
  <img src="https://skillicons.dev/icons?i=react,vite,js,css" />
</p>

### Backend & Database
<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />
</p>

### Tools
<p>
  <img src="https://skillicons.dev/icons?i=git,github" />
</p>

| Layer | Technology (v1) |
|---|---|
| **Frontend** | React, Vite, Axios |
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas (Cloud Cluster), Mongoose |
| **Styling** | Plain CSS |

---

## 🚀 Getting Started (v1)

### 1. Database Setup
Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and obtain your connection string.

### 2. Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gamified_study_tracker?retryWrites=true&w=majority
```

Run backend:
```bash
npm run dev
```
Server starts at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Client starts at `http://localhost:5173`.

---

## 📂 Project Structure

```
v1/
├── client/
│   ├── public/
│   │   ├── assets/bg.jpg
│   │   └── 1,2,3,4.png
│   └── src/
│       ├── api/api.js          # axios client — users, tasks, history
│       ├── App.jsx             # profile picker + main hub
│       ├── index.css           # theme + layout
│       └── main.jsx
└── server/
    ├── config/db.js            # Atlas connection
    ├── models/
    │   ├── User.js
    │   ├── Task.js
    │   └── History.js
    ├── routes/
    │   ├── userRoutes.js
    │   ├── taskRoutes.js
    │   └── historyRoutes.js
    ├── utils/awardXp.js
    ├── .env
    └── server.js
```

---

## 📜 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/users` | List all profiles |
| `POST` | `/users` | Create a profile — `{ username }` |
| `GET` | `/users/:id` | Fetch a single profile |
| `GET` | `/tasks/:userId` | List active (incomplete) quests for a profile |
| `POST` | `/tasks` | Create a quest — `{ title, difficulty, userId }` |
| `POST` | `/tasks/:id/complete` | Complete a quest, award XP — `{ userId }` |
| `DELETE` | `/tasks/:id` | Delete a quest |
| `POST` | `/tasks/bonus-xp` | Award XP for a finished focus session — `{ userId, minutes }` |
| `GET` | `/history/:userId` | List recent completed quests and sessions |

---

## 💡 Notes

- XP thresholds scale per level: leveling from `N` to `N+1` requires `N × 100` XP.
- Focus sessions award XP at a fixed rate of 3 XP per minute (a 25-minute session nets +75 XP).

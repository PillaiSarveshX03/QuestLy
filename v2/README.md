# QuestLy (v2) ⚔️

A gamified study tracker and productivity chamber — fully containerized with Docker, local persistent MongoDB 7.0, and a zero-install Mongo Express web GUI.

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js_20-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB_7.0-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> 🚀 **Current Recommended Version (v2):** Fully containerized with multi-container Docker networking, local persistent volume storage, and live hot-reloading. For the legacy manual version, see [**QuestLy v1 ➔**](../v1)

---

## 🎮 Features

- **Quests** — log tasks as Easy / Medium / Hard, each worth its own XP (+50 / +100 / +200).
- **Deep Focus Chamber** — a Pomodoro-style timer with selectable session lengths (15 / 25 / 45 / 60 min), earning XP proportional to time focused.
- **Leveling** — XP accumulates toward a level threshold (`level × 100`); crossing it levels you up and rolls over any excess XP.
- **Multiple Profiles** — switch between scholars with ease; your active profile is remembered across sessions.
- **History Log** — every completed quest and finished focus session is logged with a timestamp and XP earned.

### 📸 Demo (v2)

**Profile creation**

![Profile creation](client/public/1.png)

**Main dashboard**

![Main dashboard](client/public/2.png)

**Task Updation**

![Task Updation](client/public/3.png)

---

## 🛠️ Tech Stack (v2)

### Frontend
<p>
  <img src="https://skillicons.dev/icons?i=react,vite,js,css" />
</p>

### Backend & Database
<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" />
</p>

### DevOps & Containers
<p>
  <img src="https://skillicons.dev/icons?i=docker" />
</p>

### Tools
<p>
  <img src="https://skillicons.dev/icons?i=git,github" />
</p>

| Layer | Technology (v2) |
|---|---|
| **Frontend** | React 19, Vite, Axios |
| **Backend** | Node.js 20, Express |
| **Database** | MongoDB 7.0 (Local Container Engine) |
| **Database GUI** | Mongo Express 1.0.2 (Web Admin at `:8081`) |
| **Containerization** | Docker, Docker Compose |
| **Styling** | Plain CSS |

---

## 🚀 Getting Started (v2)

### 1. Launch with Docker Compose
From the project root directory:
```bash
docker compose up -d
```
*(Or if running directly from `v2/`: `docker compose -f docker-compose.dev.yml up -d`)*

### 2. Accessible Endpoints

| Service | Host URL | Description |
| :--- | :--- | :--- |
| **QuestLy App** | [http://localhost:5173](http://localhost:5173) | Gamified Scholar Dashboard & Focus Chamber |
| **Mongo Express GUI** | [http://localhost:8081](http://localhost:8081) | Visual DB management, document inspector, query tool |
| **Backend REST API** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | API health & diagnostics endpoint |
| **MongoDB Native Port**| `localhost:27017` | Direct native MongoDB connection port |

### 3. Shut Down Safely
```bash
docker compose down
```
> 🛡️ **Data Persistence:** Your scholars, quests, XP, and history are safely stored in the named Docker volume `mongo_data` and will **never be wiped** across restarts.

---

## 📂 Project Structure

```
v2/
├── docker-compose.dev.yml      # Standalone V2 development compose
├── README.md                   # V2 documentation & Docker guide
├── client/                     # Vite + React Gamified Dashboard
│   ├── Dockerfile              # Frontend container recipe
│   ├── vite.config.js          # Host 0.0.0.0 + polling watches + /api proxy
│   ├── public/                 # Demo assets & icons
│   └── src/
│       ├── api/api.js          # Axios client with dynamic /api proxy
│       ├── App.jsx             # Main dashboard & focus chamber
│       └── index.css
└── server/                     # Express REST API
    ├── Dockerfile              # Backend container recipe
    ├── config/db.js            # Auto-reconnect retry logic for Docker DB
    ├── models/                 # User, Task, History schemas
    ├── routes/                 # userRoutes, taskRoutes, historyRoutes
    ├── utils/awardXp.js
    └── server.js
```

---

## 📜 API Reference

Base URL: `http://localhost:5000/api` (or relative `/api` via Vite dev server)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Diagnostic probe verifying server uptime |
| `GET` | `/users` | List all scholar profiles |
| `POST` | `/users` | Create a profile — `{ username }` |
| `GET` | `/users/:id` | Fetch a single profile |
| `GET` | `/tasks/:userId` | List active (incomplete) quests for a scholar |
| `POST` | `/tasks` | Create a quest — `{ title, difficulty, userId }` |
| `POST` | `/tasks/:id/complete` | Complete a quest, award XP — `{ userId }` |
| `DELETE` | `/tasks/:id` | Delete a quest |
| `POST` | `/tasks/bonus-xp` | Award XP for a finished focus session — `{ userId, minutes }` |
| `GET` | `/history/:userId` | List recent completed quests and sessions |

---

## 📚 Hands-On Docker Learning Guide

### 1. Images vs. Containers
* **Image:** An immutable blueprint (e.g. `node:20-alpine`, `mongo:7.0`).
* **Container:** A running, isolated instance of an image.
* **Try it:** Run `docker images` to see downloaded/built blueprints, and `docker ps` to see active running instances.

### 2. Dockerfiles & Layer Caching
* Look at `server/Dockerfile` and `client/Dockerfile`.
* Notice how we copy `package*.json` **before** running `npm install`. Docker caches this layer; as long as your dependencies don't change, re-building takes seconds!

### 3. Named Volumes vs. Bind Mounts
* **Named Volume (`mongo_data`):** Managed by Docker under `/data/db`. High I/O performance and permanent data safety.
* **Bind Mount (`./v2/server:/app`):** Direct folder link between your Windows workspace and the Linux container. Every time you save a file, Nodemon and Vite detect it immediately.

### 4. Service Discovery & Internal Networking
* Notice `MONGO_URI=mongodb://questly-db:27017/questly` in `server`.
* We don't use hardcoded IP addresses or `localhost`. Inside `questly-network`, Docker's embedded DNS server automatically routes `questly-db` to the MongoDB container's internal IP.

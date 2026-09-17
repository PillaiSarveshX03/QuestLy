# 🛡️ QuestLy V2: Dockerized Full-Stack Architecture & Learning Guide

Welcome to **QuestLy V2**! In this version, QuestLy transitions from manual local processes to a fully containerized, production-grade local environment orchestrated with **Docker** and **Docker Compose**.

---

## 🎯 What V2 Solves
* **No Cloud Latency / Pauses:** Replaced MongoDB Atlas with a high-performance local **MongoDB 7.0 container**.
* **Zero-Install GUI:** Visual database admin via **Mongo Express** at `http://localhost:8081` without installing MongoDB Compass.
* **Persistent Named Volumes:** Your Scholar profiles, Quests, XP, and history persist safely in `mongo_data` even across container restarts and system reboots.
* **DNS-Based Multi-Container Networking:** Services discover each other automatically by name (`questly-db`, `questly-server`, `questly-client`) on an isolated Docker bridge network.
* **Instant Hot-Reloading:** Source code directories are bind-mounted into containers so code edits in your IDE trigger instant live reload in both Express (Nodemon) and Vite React.

---

## 🏗️ Architecture Diagram

```
       Browser (Host Machine)
          │               │
  :5173   │               │   :8081
┌─────────▼─────┐   ┌─────▼────────────────┐
│ questly-client│   │ questly-mongo-express│
│ (Vite React)  │   │ (Browser DB Admin)   │
└───────┬───────┘   └──────────┬───────────┘
        │ /api                 │ Direct Bridge
┌───────▼───────┐              │
│ questly-server│              │
│ (Express API) │              │
└───────┬───────┘              │
        │ :27017               │
┌───────▼──────────────────────▼───────────┐
│              questly-db                  │
│             (MongoDB 7.0)                │
└───────────────────┬──────────────────────┘
                    │
            ┌───────▼───────┐
            │  mongo_data   │ (Named Persistent Volume)
            └───────────────┘
```

---

## 🚀 Quick Start Commands

### 1. Launch the Full Stack
From the project root directory:
```bash
docker compose up -d --build
```

### 2. Verify Running Containers
```bash
docker compose ps
```

### 3. Check Live Logs
```bash
# Follow logs for all containers:
docker compose logs -f

# Or follow logs for a specific service:
docker compose logs -f questly-server
docker compose logs -f questly-client
docker compose logs -f questly-db
```

### 4. Stop Containers Safely
```bash
# Stops and removes containers, preserves data volume:
docker compose down

# Note: Your data is 100% safe in the named volume 'mongo_data'!
```

---

## 🌐 Accessible Endpoints

| Service | Host URL | Description |
| :--- | :--- | :--- |
| **QuestLy App** | [http://localhost:5173](http://localhost:5173) | Gamified Scholar Dashboard & Focus Chamber |
| **Mongo Express GUI** | [http://localhost:8081](http://localhost:8081) | Visual DB management, document inspector, query tool |
| **Backend REST API** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | API health & diagnostics endpoint |
| **MongoDB Native Port**| `localhost:27017` | Accessible by external tools or Studio 3T / Compass if desired |

---

## 📚 Hands-On Docker Learning Progression

### Concept 1: Images vs. Containers
* **Image:** An immutable blueprint (e.g. `node:20-alpine`, `mongo:7.0`).
* **Container:** A running, isolated instance of an image.
* **Try it:** Run `docker images` to see downloaded and built blueprints, and `docker ps` to see active running instances.

### Concept 2: Dockerfiles & Layer Caching
* Look at `v2/server/Dockerfile` and `v2/client/Dockerfile`.
* Notice how we copy `package*.json` **before** running `npm install`. Docker caches this layer; as long as your dependencies don't change, re-building takes seconds!

### Concept 3: Named Volumes vs. Bind Mounts
* **Named Volume (`mongo_data`):** Managed by Docker under `/data/db`. High I/O performance and data safety.
* **Bind Mount (`./v2/server:/app`):** Direct folder link between your Windows workspace and the Linux container. Every time you save a file, Nodemon and Vite detect it immediately.

### Concept 4: Service Discovery & Internal Networking
* Notice `MONGO_URI=mongodb://questly-db:27017/questly` in `server`.
* We don't use hardcoded IP addresses or `localhost`. Inside `questly-network`, Docker's embedded DNS server automatically routes `questly-db` to the MongoDB container's internal IP.

---

## 🧪 Testing Data Persistence
Want to prove that your data is safe?
1. Open [http://localhost:5173](http://localhost:5173) and create a Scholar named **"Atlas Slayer"**.
2. Add and complete a quest to earn XP.
3. Shut down the entire stack:
   ```bash
   docker compose down
   ```
4. Confirm no containers are running with `docker compose ps`.
5. Bring the stack back up:
   ```bash
   docker compose up -d
   ```
6. Refresh [http://localhost:5173](http://localhost:5173). Your Scholar "Atlas Slayer", your XP, and your quests are right there!

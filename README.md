<!-- ![Dashboard Preview](client/src/assets/under-construction-512.png) -->

<p align="center">
  <img src="client/src/assets/under-construction-512.png" alt="Under Construction" width="512">
</p>

# FootyStats Pro ⚽️

FootyStats Pro is a modern, high-performance dashboard for football statistics and betting insights. It synchronizes real-time match data from top European 🇮🇹🇪🇸🇫🇷🇩🇪🏴󠁧󠁢󠁥󠁮󠁧󠁿 leagues and the Turkish 🇹🇷 Süper Lig using the API-Football (RapidAPI) integration.

## 🚀 Features

- **Live Match Center:** Real-time scores and upcoming fixtures with team logos.
- **Top Leagues Support:** Premier League, La Liga, Bundesliga, Serie A, Ligue 1, and Süper Lig.
- **Dark Mode UI:** Sleek, modern interface built with React and custom CSS.
- **Data Synchronization:** Automated and manual sync scripts to keep the database up-to-date.
- **Dockerized Environment:** One-command setup for Frontend, Backend, and PostgreSQL.
- **Betting Odds:** Integrated odds placeholders for match analysis (Upcoming).

## 🛠 Tech Stack

- **Frontend:** React 19 (TypeScript), Vite, Lucide-React, Date-fns.
- **Backend:** Node.js (Express), Axios, Dotenv.
- **Database:** PostgreSQL 15, Prisma ORM 7.
- **Infrastructure:** Docker, Docker Compose.

## 📦 Installation

### Prerequisites
- Docker & Docker Compose
- RapidAPI Key (API-Football)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/footystats-pro.git
   cd footystats-pro
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the `server/` directory:
   ```env
   DATABASE_URL="postgresql://postgres:password123@db:5432/footy_stats_db?schema=public"
   RAPIDAPI_KEY="your_api_key_here"
   RAPIDAPI_HOST="api-football-v1.p.rapidapi.com"
   PORT=3001
   ```

3. **Spin up the containers:**
   ```bash
   docker compose up -d --build
   ```

4. **Initialize Database & Sync Data:**
   ```bash
   docker exec footy_server npx prisma db push
   docker exec footy_server node sync.js
   ```

## 🖥 Usage

- **Frontend:** [http://localhost:5185](http://localhost:5185)
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- **Manual Sync:** Trigger via `POST http://localhost:3001/api/sync`

## 📂 Project Structure

```text
├── client/           # React + Vite Frontend
├── server/           # Express + Prisma Backend
│   ├── prisma/       # Database Schema & Migrations
│   ├── sync.js       # API-Football Sync Script
│   └── index.js      # Main API Server
└── docker-compose.yml # Orchestration
```

## 🤝 Contributing

1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License.

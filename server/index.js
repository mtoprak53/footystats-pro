const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Prisma 7 Connection with Driver Adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const { syncLeagues, syncMatches } = require('./sync');

const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/matches', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      include: { league: true, odds: true },
      orderBy: { utcTime: 'asc' },
    });
    res.json(matches);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sync', async (req, res) => {
  try {
    await syncLeagues();
    const leagues = await prisma.league.findMany();
    for (const league of leagues) {
      await syncMatches(league.apiId);
    }
    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is up on port ${PORT}`);
});

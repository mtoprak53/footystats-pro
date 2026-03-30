const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data
  await prisma.odds.deleteMany({});
  await prisma.match.deleteMany({});
  await prisma.league.deleteMany({});

  // 1. Create Leagues
  const international = await prisma.league.create({
    data: { name: 'International Friendlies', country: 'World' }
  });

  // 2. Create Matches & Odds
  const matches = [
    {
      homeTeam: 'Germany',
      awayTeam: 'Ghana',
      utcTime: new Date('2026-03-30T18:45:00Z'),
      score: 'v',
      status: 'Upcoming',
      odds: { homeWin: 1.45, draw: 4.20, awayWin: 7.50 }
    },
    {
      homeTeam: 'France',
      awayTeam: 'Colombia',
      utcTime: new Date('2026-03-29T19:00:00Z'),
      score: '3 - 1',
      status: 'Finished',
      odds: { homeWin: 1.80, draw: 3.40, awayWin: 4.20 }
    },
    {
      homeTeam: 'Indonesia',
      awayTeam: 'Bulgaristan',
      utcTime: new Date('2026-03-30T13:00:00Z'),
      score: 'v',
      status: 'Upcoming',
      odds: { homeWin: 3.10, draw: 3.20, awayWin: 2.30 }
    }
  ];

  for (const m of matches) {
    const { odds, ...matchData } = m;
    await prisma.match.create({
      data: {
        ...matchData,
        leagueId: international.id,
        odds: {
          create: odds
        }
      }
    });
  }

  console.log('✅ Seed data successfully created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

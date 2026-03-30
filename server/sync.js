const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const options = {
  headers: {
    'x-rapidapi-key': process.env.RAPIDAPI_KEY,
    'x-rapidapi-host': process.env.RAPIDAPI_HOST
  }
};

async function syncLeagues(leagueIds = [39, 140, 78, 135, 61, 203]) { // Premier League, La Liga, Bundesliga, Serie A, Ligue 1, Süper Lig
  console.log('🔄 Syncing Leagues...');
  for (const id of leagueIds) {
    try {
      const response = await axios.get(`https://${process.env.RAPIDAPI_HOST}/v3/leagues?id=${id}`, options);
      const leagueData = response.data.response[0];
      if (leagueData) {
        await prisma.league.upsert({
          where: { apiId: leagueData.league.id },
          update: {
            name: leagueData.league.name,
            country: leagueData.country.name,
            logo: leagueData.league.logo
          },
          create: {
            apiId: leagueData.league.id,
            name: leagueData.league.name,
            country: leagueData.country.name,
            logo: leagueData.league.logo
          }
        });
        console.log(`✅ Synced League: ${leagueData.league.name}`);
      }
    } catch (error) {
      console.error(`❌ Error syncing league ${id}:`, error.message);
    }
  }
}

async function syncMatches(leagueId, season = 2025) {
  console.log(`🔄 Syncing Matches for League ${leagueId}...`);
  try {
    const response = await axios.get(`https://${process.env.RAPIDAPI_HOST}/v3/fixtures?league=${leagueId}&season=${season}&next=10`, options);
    const fixtures = response.data.response;

    for (const f of fixtures) {
      await prisma.match.upsert({
        where: { apiId: f.fixture.id },
        update: {
          utcTime: new Date(f.fixture.date),
          homeTeam: f.teams.home.name,
          homeLogo: f.teams.home.logo,
          awayTeam: f.teams.away.name,
          awayLogo: f.teams.away.logo,
          score: f.goals.home !== null ? `${f.goals.home}-${f.goals.away}` : 'v',
          status: f.fixture.status.long
        },
        create: {
          apiId: f.fixture.id,
          utcTime: new Date(f.fixture.date),
          homeTeam: f.teams.home.name,
          homeLogo: f.teams.home.logo,
          awayTeam: f.teams.away.name,
          awayLogo: f.teams.away.logo,
          score: f.goals.home !== null ? `${f.goals.home}-${f.goals.away}` : 'v',
          status: f.fixture.status.long,
          league: { connect: { apiId: leagueId } }
        }
      });
    }
    console.log(`✅ Synced ${fixtures.length} matches for League ${leagueId}`);
  } catch (error) {
    console.error(`❌ Error syncing matches for league ${leagueId}:`, error.message);
  }
}

async function runSync() {
  await syncLeagues();
  const leagues = await prisma.league.findMany();
  for (const league of leagues) {
    await syncMatches(league.apiId);
  }
  process.exit();
}

if (require.main === module) {
  runSync();
}

module.exports = { syncLeagues, syncMatches };

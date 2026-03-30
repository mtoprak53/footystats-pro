import React, { useState, useEffect } from 'react';
import { Trophy, Activity, Calendar, Settings, Tv, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import './App.css';

// Type definitions
interface League {
  id: number;
  name: string;
  logo: string;
}

interface Match {
  id: number;
  homeTeam: string;
  homeLogo?: string;
  awayTeam: string;
  awayLogo?: string;
  utcTime: string;
  score: string;
  status: string;
  league: League;
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  } | null;
}

function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('/api/matches');
        setMatches(response.data);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch matches from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);
  
  // Format time to EDT (System is already in EDT)
  const formatToEDT = (utcString: string) => {
    const date = new Date(utcString);
    return format(date, 'HH:mm');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Trophy size={28} />
          <span>FootyStats</span>
        </div>
        <nav>
          <a href="#" className="nav-item active"><Activity size={20} /> Dashboard</a>
          <a href="#" className="nav-item"><Calendar size={20} /> Schedule</a>
          <a href="#" className="nav-item"><TrendingUp size={20} /> Analysis</a>
          <a href="#" className="nav-item"><Tv size={20} /> TV Guide</a>
          <a href="#" className="nav-item"><Settings size={20} /> Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Match Center</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Live updates from top European leagues</p>
          </div>
          <div className="timezone-info">
            Current Zone: <strong>EDT (UTC-4)</strong>
          </div>
        </header>

        {loading ? (
          <div className="loading">Loading live matches...</div>
        ) : error ? (
          <div className="error-card">
            <AlertCircle size={40} />
            <p>{error}</p>
          </div>
        ) : (
          <section className="match-grid">
            {matches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-header">
                  <img src={match.league.logo} alt={match.league.name} className="league-logo" />
                  <span className="league-name">{match.league.name}</span>
                  <span className="match-time-badge">{formatToEDT(match.utcTime)}</span>
                </div>
                
                <div className="match-teams-new">
                  <div className="team">
                    <img src={match.homeLogo} alt={match.homeTeam} className="team-logo" />
                    <span className="team-name">{match.homeTeam}</span>
                  </div>
                  
                  <div className="score-area">
                    <span className="score-badge">{match.score}</span>
                  </div>
                  
                  <div className="team">
                    <img src={match.awayLogo} alt={match.awayTeam} className="team-logo" />
                    <span className="team-name">{match.awayTeam}</span>
                  </div>
                </div>

                <div className="bet-odds">
                  {match.odds ? (
                    <>
                      <button className="odd-btn">1: {match.odds.homeWin.toFixed(2)}</button>
                      <button className="odd-btn">X: {match.odds.draw.toFixed(2)}</button>
                      <button className="odd-btn">2: {match.odds.awayWin.toFixed(2)}</button>
                    </>
                  ) : (
                    <span className="no-odds">Odds N/A</span>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from '../components/Navbar';
import './Dashboard.css';
import { COURSES } from '../data/mockData';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const ongoing = COURSES[0];

  return (
    <div className="dashboard">
      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">
          <div className="dash-logo-mark"><LogoMark dark={false} /></div>
          <span className="dash-logo-text">UVSHUB</span>
        </Link>
        <nav className="dash-nav">
          {['Overview', 'My Learning', 'Certificates', 'Settings'].map(t => (
            <button
              key={t}
              className={`dash-nav-item${activeTab === t ? ' dash-nav-item--active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </nav>
        <div className="dash-user">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="User" className="dash-user-av" />
          <div className="dash-user-info">
            <span className="dash-user-name">Aisha Patel</span>
            <span className="dash-user-plan">PRO_02 NODE</span>
          </div>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div className="dash-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Query database..." />
          </div>
          <div className="dash-header-actions">
            <div className="dash-bell">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
          </div>
        </header>

        <div className="dash-content">
          <h1 className="dash-title">Telemetry Overview</h1>
          <p className="dash-sub">Welcome back, operative. Here is your current network status.</p>

          <div className="dash-stats">
            {[
              { label: 'ACTIVE MODULES', val: '04', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
              { label: 'COMPLETED', val: '12', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
              { label: 'CERTIFICATES', val: '03', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
            ].map(s => (
              <div key={s.label} className="dash-stat-card">
                <div className="dash-stat-head">
                  <span className="dash-stat-label">{s.label}</span>
                  <div className="dash-stat-icon">{s.icon}</div>
                </div>
                <div className="dash-stat-val">{s.val}</div>
              </div>
            ))}
          </div>

          <div className="dash-grid">
            <div className="dash-panel">
              <div className="dash-panel-head">
                <span className="dash-panel-title">Current Transmission</span>
                <Link to="/courses" className="dash-panel-link">BROWSE NETWORK</Link>
              </div>
              <div className="dash-panel-body">
                <div className="dash-course">
                  <img src={ongoing.thumb} alt={ongoing.title} className="dash-course-thumb" />
                  <div className="dash-course-info">
                    <div className="dash-course-title">{ongoing.title}</div>
                    <div className="dash-course-prog">
                      <div className="dash-cbar"><div className="dash-cfill" style={{ width: '68%' }} /></div>
                      <span className="dash-cpct">68%</span>
                    </div>
                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>Resume Playback</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="dash-panel">
              <div className="dash-panel-head">
                <span className="dash-panel-title">Network Activity</span>
              </div>
              <div className="dash-panel-body dash-feed">
                {[
                  { id: 1, action: 'Completed module', item: 'Advanced State Management', time: '2 HOURS AGO', type: 'check' },
                  { id: 2, action: 'Downloaded resource', item: 'Architecture Blueprint', time: '1 DAY AGO', type: 'file' },
                  { id: 3, action: 'Earned certificate', item: 'UI/UX Fundamentals', time: '3 DAYS AGO', type: 'award' },
                ].map(act => (
                  <div key={act.id} className="dash-activity">
                    <div className="dash-act-icon">
                      {act.type === 'check' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                      {act.type === 'file' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
                      {act.type === 'award' && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>}
                    </div>
                    <div>
                      <div className="dash-act-text">{act.action} <strong>{act.item}</strong></div>
                      <div className="dash-act-time">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

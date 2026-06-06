import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/Navbar';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleReg = (e) => {
    e.preventDefault();
    setErr('');
    if (!name || !email || !pwd) {
      setErr('All fields are required to initialize an account.');
      return;
    }
    setLoading(true);
    setTimeout(() => navigate('/dashboard'), 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel__inner">
          <Link to="/" className="auth-logo">
            <div className="auth-logo-mark"><LogoMark dark={false} /></div>
            <span className="auth-logo-text">UVSHUB</span>
          </Link>

          <h1 className="auth-title">Initialize Access</h1>
          <p className="auth-sub">Join the network. Create your operative profile.</p>

          {err && (
            <div className="auth-error" style={{ marginBottom: '24px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {err}
            </div>
          )}

          <form className="auth-form" onSubmit={handleReg}>
            <div className="auth-field">
              <label className="auth-label">Operative Designation (Full Name)</label>
              <div className="auth-input-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Network ID (Email)</label>
              <div className="auth-input-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="operative@uvshub.net"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Passkey</label>
              <div className="auth-input-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type="password"
                  className="auth-input"
                  placeholder="••••••••"
                  value={pwd}
                  onChange={e => setPwd(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
              {loading ? 'INITIALIZING...' : 'CREATE PROFILE'}
            </button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--ink-3)' }}>
            Already have clearance? <Link to="/login" className="auth-link">Login to Terminal</Link>
          </p>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-quote-card" style={{ animationDelay: '-2s', borderColor: 'rgba(45, 212, 191, 0.3)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          <div className="auth-quote">"The data science modules are exceptional. The telemetry allows me to track my progress with pinpoint accuracy."</div>
          <div className="auth-author">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" alt="Marcus Thompson" />
            <div>
              <div className="auth-author-name">Marcus Thompson</div>
              <div className="auth-author-role">Data Analyst, Airbnb</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

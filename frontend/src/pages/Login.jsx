import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/Navbar';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !pwd) {
      setErr('Please provide valid credentials.');
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

          <h1 className="auth-title">Terminal Login</h1>
          <p className="auth-sub">Access your learning matrix. Enter your credentials below.</p>

          {err && (
            <div className="auth-error" style={{ marginBottom: '24px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {err}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
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
              <label className="auth-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Passkey
                <a href="#" className="auth-link" style={{ fontSize: '11px' }}>Forgot?</a>
              </label>
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
              {loading ? 'AUTHENTICATING...' : 'INITIALIZE'}
            </button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--ink-3)' }}>
            No access clearance? <Link to="/register" className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>

      <div className="auth-visual">
        <div className="auth-quote-card">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          <div className="auth-quote">"The interface is so deep and intuitive, it feels less like learning and more like downloading knowledge directly into my brain."</div>
          <div className="auth-author">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Aisha Patel" />
            <div>
              <div className="auth-author-name">Aisha Patel</div>
              <div className="auth-author-role">Frontend Operative, Meta</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

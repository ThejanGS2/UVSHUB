import { Link } from 'react-router-dom';
import './Features.css';
import SpotlightCard from './ui/SpotlightCard';
import Reveal from './ui/Reveal';
import portrait1 from '../assets/portrait1.png';
import portrait2 from '../assets/portrait2.png';
import portrait3 from '../assets/portrait3.png';

const progress = [
  { label: 'SYS_DEV',   pct: 82 },
  { label: 'DSGN_OPS',  pct: 67 },
  { label: 'DATA_SCI',  pct: 54 },
];

function Features() {
  return (
    <section className="features" id="approach" aria-labelledby="features-heading">
      <div className="features__inner">

        <div className="features__header">
          <div className="features__header-left">
            <div className="tag">ARCHITECTURE</div>
            <h2 className="features__header-title" id="features-heading">
              Engineered for<br /><em>deep learning.</em>
            </h2>
            <p className="features__header-sub">
              Every system is precision-designed for rapid skill acquisition and knowledge retention.
            </p>
          </div>
          <Link to="/courses" className="btn btn-outline">
            Access Database
          </Link>
        </div>

        <Reveal direction="up" delay={200}>
          <div className="bento">

            {/* Big text cell — Expert Instructors */}
            <SpotlightCard className="bento-cell bento-cell--c8 bento-cell--r2 bento-cell--glow-violet" glowColor="rgba(143, 85, 255, 0.2)">
              <div className="bento-cell__icon" style={{ color: 'var(--violet)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
              </div>
              <div className="bento-cell__title" style={{ fontSize: '24px' }}>Vetted Neural Instructors</div>
              <div className="bento-cell__desc" style={{ fontSize: '15px', maxWidth: '400px' }}>
                Learn from industry operatives actively pushing boundaries in their fields. Real-world experience transmitted directly to you.
              </div>
              <div style={{ marginTop: 'auto' }}>
                <div className="bento-avatars" style={{ marginBottom: '10px' }}>
                  {[portrait1, portrait2, portrait3].map((s, i) => (
                    <img key={i} src={s} alt="" className="bento-avatar" />
                  ))}
                  <span style={{ marginLeft: '12px', fontSize: '12px', fontFamily: 'var(--mono)', color: 'var(--ink-4)' }}>240+ EXPERTS ONLINE</span>
                </div>
              </div>
            </SpotlightCard>

            {/* Stat — Students */}
            <SpotlightCard className="bento-cell bento-cell--c4 bento-cell--glow-accent" glowColor="rgba(226, 255, 74, 0.2)">
              <div className="bento-cell__stat">8,600</div>
              <div className="bento-cell__stat-label">Active Nodes Connected</div>
              <div className="bento-cell__visual">
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                  <circle cx="80" cy="80" r="60" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4"/>
                </svg>
              </div>
            </SpotlightCard>

            {/* Learning progress */}
            <SpotlightCard className="bento-cell bento-cell--c4">
              <div className="bento-cell__icon" style={{ color: 'var(--accent)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div className="bento-cell__title">Telemetry</div>
              <div className="bento-progress">
                {progress.map(p => (
                  <div key={p.label} className="bento-progress-row">
                    <span className="bento-progress-label">{p.label}</span>
                    <div className="bento-progress-bar"><div className="bento-progress-fill" style={{ width: `${p.pct}%` }} /></div>
                    <span className="bento-progress-pct">{p.pct}%</span>
                  </div>
                ))}
              </div>
            </SpotlightCard>

            {/* Certificate */}
            <SpotlightCard className="bento-cell bento-cell--c4">
              <div className="bento-cell__icon" style={{ color: 'var(--blue)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div className="bento-cell__title">Verified Credentials</div>
              <div className="bento-cell__desc">Cryptographically verifiable certificates. Share your clearance instantly.</div>
            </SpotlightCard>

            {/* Categories */}
            <SpotlightCard className="bento-cell bento-cell--c4 bento-cell--glow-blue" glowColor="rgba(45, 212, 191, 0.2)">
              <div className="bento-cell__icon" style={{ color: 'var(--blue)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              </div>
              <div className="bento-cell__title">All Sectors</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                {['WEB_DEV','DSGN','DATA','MKTG','SYS'].map(t => (
                  <span key={t} style={{ fontSize: '11px', fontFamily: 'var(--mono)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px', color: 'var(--ink-3)' }}>{t}</span>
                ))}
              </div>
            </SpotlightCard>

            {/* Lifetime access */}
            <SpotlightCard className="bento-cell bento-cell--c4">
              <div className="bento-cell__icon" style={{ color: 'var(--white)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="bento-cell__title">Perpetual Access</div>
              <div className="bento-cell__desc">No expiry. No deadlines. Learn at your own optimal bandwidth.</div>
            </SpotlightCard>

            {/* Stat — Courses */}
            <SpotlightCard className="bento-cell bento-cell--c4">
              <div className="bento-cell__stat">1,160</div>
              <div className="bento-cell__stat-label">Data modules online</div>
            </SpotlightCard>

          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Features;

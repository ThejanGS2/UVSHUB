import './Hero.css';
import portrait1 from '../assets/portrait1.png';
import portrait2 from '../assets/portrait2.png';
import portrait3 from '../assets/portrait3.png';
import portrait4 from '../assets/portrait4.png';

const stats = [
  {
    id: 'stat-students',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="stat-badge__svg">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3.5" fill="#2563eb" />
      </svg>
    ),
    value: '8600',
    position: 'top-left'
  },
  {
    id: 'stat-courses',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#f97316" stroke="#f97316" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="stat-badge__svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    value: '1160',
    position: 'top-right'
  },
  {
    id: 'stat-saved',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="stat-badge__svg">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    value: '1520',
    position: 'mid-left'
  },
  {
    id: 'stat-certificates',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#22c55e" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stat-badge__svg">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
    value: '730',
    position: 'mid-right'
  },
];

const portraits = [
  { id: 'portrait-1', src: portrait1, alt: 'Blonde woman by the ocean',  rotate: '-6deg', translateX: '-20px', zIndex: 1 },
  { id: 'portrait-2', src: portrait2, alt: 'Man in colorful jacket',      rotate: '-2deg', translateX: '-10px', zIndex: 2 },
  { id: 'portrait-3', src: portrait3, alt: 'Woman among flowers',         rotate: '2deg',  translateX: '0px',   zIndex: 3 },
  { id: 'portrait-4', src: portrait4, alt: 'Woman with white sunglasses', rotate: '6deg',  translateX: '10px',  zIndex: 4 },
];

function StatBadge({ stat }) {
  return (
    <div className={`stat-badge stat-badge--${stat.position}`} id={stat.id}>
      <span className="stat-badge__icon">{stat.icon}</span>
      <span className="stat-badge__value">{stat.value}</span>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero" aria-labelledby="hero-heading">

      {/* Floating stat badges */}
      {stats.map((stat) => (
        <StatBadge key={stat.id} stat={stat} />
      ))}

      {/* Text content */}
      <div className="hero__content">
        <h1 className="hero__heading" id="hero-heading">
          <span className="hero__heading-nowrap">Learn Without</span><br />Limits
        </h1>
        <p className="hero__subtext">
          A modern learning platform built for curious minds —<br />
          explore courses, build real skills, and grow at your own pace.
        </p>

        <div className="hero__actions">
          <button id="hero-enroll-btn" className="hero__btn hero__btn--dark">Get Started</button>
          <button id="hero-details-btn" className="hero__btn hero__btn--light">Browse Courses</button>
        </div>
      </div>

      {/* Portrait fan */}
      <div className="hero__portraits" id="hero-portraits" aria-label="Student portraits">
        {portraits.map((p) => (
          <div
            key={p.id}
            id={p.id}
            className="hero__portrait-card"
            style={{
              transform: `rotate(${p.rotate}) translateX(${p.translateX})`,
              zIndex: p.zIndex,
            }}
          >
            <img src={p.src} alt={p.alt} className="hero__portrait-img" />
          </div>
        ))}
      </div>

    </section>
  );
}

export default Hero;

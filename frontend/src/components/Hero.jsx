import './Hero.css';
import portrait1 from '../assets/portrait1.png';
import portrait2 from '../assets/portrait2.png';
import portrait3 from '../assets/portrait3.png';
import portrait4 from '../assets/portrait4.png';

const stats = [
  { id: 'stat-students',     icon: '🔵', value: '8,600', position: 'top-left'  },
  { id: 'stat-courses',      icon: '🟠', value: '1,160', position: 'top-right' },
  { id: 'stat-saved',        icon: '❤️', value: '1,520', position: 'mid-left'  },
  { id: 'stat-certificates', icon: '🟢', value: '730',   position: 'mid-right' },
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
          Learn Without<br />Limits
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

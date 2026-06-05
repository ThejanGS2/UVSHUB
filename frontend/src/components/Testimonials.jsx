import './Testimonials.css';
import { INSTRUCTORS, TESTIMONIALS } from '../data/mockData';

// Duplicate array for seamless marquee loop
const doubled = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

function Testimonials() {
  return (
    <section className="testimonials" id="instructors" aria-labelledby="testimonials-heading">
      <div className="testimonials__inner">

        <div className="testimonials__header">
          <div className="tag" style={{ margin: '0 auto' }}>NETWORK_DATA</div>
          <h2 className="testimonials__header-title" id="testimonials-heading">
            Learn from operatives.<br /><em>Verified results.</em>
          </h2>
          <p className="testimonials__header-sub">
            Real-world experts. Thousands of successful transmissions.
          </p>
        </div>

        {/* Instructors */}
        <div className="instructors" id="instructors-grid">
          {INSTRUCTORS.map(inst => (
            <div key={inst.id} id={inst.id} className="instructor-card">
              <div className="instructor-card__head">
                <img src={inst.avatar} alt={inst.name} className="instructor-card__avatar" loading="lazy" />
                <div>
                  <div className="instructor-card__name">{inst.name}</div>
                  <div className="instructor-card__role">{inst.title}</div>
                </div>
              </div>
              <p className="instructor-card__bio">{inst.bio}</p>
              <div className="instructor-card__stats">
                {[
                  { val: inst.students, label: 'NODES' },
                  { val: inst.courses,  label: 'MODULES'  },
                  { val: `${inst.rating}★`, label: 'RATING' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="instructor-stat__val">{s.val}</div>
                    <div className="instructor-stat__label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Marquee */}
        <div className="testimonials__marquee-wrap" aria-label="Student testimonials">
          <div className="testimonials__marquee">
            {doubled.map((t, i) => (
              <div key={`${t.id}-${i}`} className="tcard">
                <div className="tcard__stars">{'★'.repeat(t.rating)}</div>
                <blockquote className="tcard__quote">"{t.quote}"</blockquote>
                <div className="tcard__author">
                  <img src={t.avatar} alt={t.name} className="tcard__avatar" loading="lazy" />
                  <div>
                    <div className="tcard__name">{t.name}</div>
                    <div className="tcard__role">{t.role}</div>
                    <div className="tcard__course">{'//'} {t.course}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Testimonials;

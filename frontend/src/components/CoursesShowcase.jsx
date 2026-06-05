import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CoursesShowcase.css';
import CourseCard from './ui/CourseCard';
import Reveal from './ui/Reveal';
import { COURSES, CATEGORIES } from '../data/mockData';

function CoursesShowcase() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? COURSES.slice(0, 8) : COURSES.filter(c => c.category === active).slice(0, 8);

  return (
    <section className="showcase" id="courses" aria-labelledby="showcase-heading">
      <div className="showcase__inner">
        <div className="showcase__header">
          <div>
            <div className="tag">DATABASE</div>
            <h2 className="showcase__header-title" id="showcase-heading">
              Curated modules<br />for deep focus.
            </h2>
            <p className="showcase__header-sub">Access over 1,160 highly-calibrated training simulations.</p>
          </div>
          <Link to="/courses" className="btn btn-outline" id="showcase-view-all">
            Query All Records
          </Link>
        </div>

        <div className="showcase__tabs" role="tablist">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              role="tab"
              id={`tab-${cat.toLowerCase().replace(/\s+/g,'-')}`}
              className={`showcase__tab${active === cat ? ' showcase__tab--active' : ''}`}
              aria-selected={active === cat}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <Reveal direction="up" delay={100}>
          <div className="showcase__grid" role="tabpanel">
            {filtered.length > 0
              ? filtered.map(c => <CourseCard key={c.id} course={c} />)
              : <p style={{ color: 'var(--ink-4)', gridColumn: '1/-1', padding: '40px', textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '14px' }}>NO_RECORDS_FOUND</p>
            }
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default CoursesShowcase;

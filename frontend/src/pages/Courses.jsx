import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoMark } from '../components/Navbar';
import './Courses.css';
import CourseCard from '../components/ui/CourseCard';
import { COURSES, CATEGORIES } from '../data/mockData';

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const DURATIONS = ['Any duration', '0-2 Hours', '3-6 Hours', '7+ Hours'];

function Courses() {
  const [cat, setCat] = useState('All');
  const [lvl, setLvl] = useState('All Levels');
  const [dur, setDur] = useState('Any duration');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popular');

  const filtered = COURSES.filter(c => {
    if (cat !== 'All' && c.category !== cat) return false;
    if (lvl !== 'All Levels' && c.level !== lvl) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="courses-page">
      {/* Navbar Minimal */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', zIndex: 100, background: 'rgba(3,3,4,0.6)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--white)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LogoMark dark={false} /></div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '16px', fontWeight: 600, color: 'var(--white)', letterSpacing: '0.1em' }}>UVSHUB</span>
        </Link>
        <Link to="/dashboard" className="btn btn-outline" style={{ fontFamily: 'var(--mono)', fontSize: '12px', padding: '10px 20px' }}>Dashboard</Link>
      </nav>

      {/* Hero */}
      <header className="courses-hero">
        <div className="courses-hero__inner">
          <div className="tag" style={{ background: 'var(--violet-light)', borderColor: 'var(--violet)', color: 'var(--violet)' }}>DATABASE ACCESS</div>
          <h1>Find your next <em>breakthrough.</em></h1>
          <p>Over 1,160 expert-led neural transmissions across development, spatial design, and data science.</p>

          <div className="courses-search">
            <div className="courses-search__wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Query database for specific modules..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="courses-search__btn">Execute Search</button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="courses-body">
        {/* Filters sidebar */}
        <aside className="courses-filter">
          <div className="courses-filter__header">
            <span className="courses-filter__title">Parameters</span>
            <button className="courses-filter__reset" onClick={() => { setCat('All'); setLvl('All Levels'); setDur('Any duration'); setSearch(''); }}>
              Reset
            </button>
          </div>

          <div className="courses-filter__section">
            <div className="courses-filter__sec-title">Sector</div>
            {['All', ...CATEGORIES].map(c => (
              <label key={c} className="courses-filter__opt">
                <input type="radio" name="cat" checked={cat === c} onChange={() => setCat(c)} />
                {c}
              </label>
            ))}
          </div>

          <div className="courses-filter__section">
            <div className="courses-filter__sec-title">Bandwidth Level</div>
            {LEVELS.map(l => (
              <label key={l} className="courses-filter__opt">
                <input type="radio" name="lvl" checked={lvl === l} onChange={() => setLvl(l)} />
                {l}
              </label>
            ))}
          </div>

          <div className="courses-filter__section">
            <div className="courses-filter__sec-title">Duration</div>
            {DURATIONS.map(d => (
              <label key={d} className="courses-filter__opt">
                <input type="radio" name="dur" checked={dur === d} onChange={() => setDur(d)} />
                {d}
              </label>
            ))}
          </div>
        </aside>

        {/* Results */}
        <main className="courses-results">
          <div className="courses-toolbar">
            <div className="courses-toolbar__count">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'RECORD' : 'RECORDS'} MATCHED
            </div>
            <div className="courses-sort">
              <span className="courses-sort__label">Sort:</span>
              <select className="courses-sort__select" value={sort} onChange={e => setSort(e.target.value)}>
                <option value="popular">Priority / Popular</option>
                <option value="newest">Recent Commits</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="courses-grid">
            {filtered.map(c => <CourseCard key={c.id} course={c} />)}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px', color: 'var(--ink-4)', border: '1px dashed var(--border)', borderRadius: 'var(--r-xl)', fontFamily: 'var(--mono)', fontSize: '13px' }}>
              NO RECORDS MATCHING QUERY PARAMETERS.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Courses;

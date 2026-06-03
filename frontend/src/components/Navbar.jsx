import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { id: 'nav-approach',   label: 'Approach',   href: '#approach'   },
  { id: 'nav-instructor', label: 'Instructor',  href: '#instructor' },
  { id: 'nav-curriculum', label: 'Curriculum',  href: '#curriculum' },
  { id: 'nav-pricing',    label: 'Pricing',     href: '#pricing'    },
];

function Navbar() {
  const [active, setActive] = useState('nav-instructor');

  return (
    <nav className="navbar" id="navbar" role="navigation" aria-label="Main navigation">


      {/* ── Nav links pill ── */}
      <div className="navbar__pill" role="list">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            id={link.id}
            href={link.href}
            role="listitem"
            className={`navbar__link${active === link.id ? ' navbar__link--active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActive(link.id); }}
            aria-current={active === link.id ? 'page' : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* ── Enroll Now CTA ── */}
      <Link to="/student/register" id="navbar-enroll-btn" className="navbar__cta" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        Enroll Now
      </Link>

    </nav>
  );
}

export default Navbar;

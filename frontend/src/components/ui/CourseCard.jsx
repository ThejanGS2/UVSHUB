import { Link } from 'react-router-dom';
import './CourseCard.css';

function CourseCard({ course }) {
  const { id, title, instructor, category, rating, reviewCount, duration, price, originalPrice, level, badge, thumb } = course;
  const badgeCls = badge === 'Bestseller' ? 'bestseller' : badge === 'New' ? 'new' : 'hot';
  const isFree = price === 0;

  return (
    <Link to={`/courses/${id}`} className="course-card" id={`course-${id}`} aria-label={title}>
      {/* Thumb */}
      <div className="course-card__thumb">
        <img src={thumb} alt={title} className="course-card__thumb-img" loading="lazy" />
        <div className="course-card__thumb-overlay" aria-hidden="true">
          <div className="course-card__thumb-play">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        {badge && <span className={`course-card__badge course-card__badge--${badgeCls}`}>{badge}</span>}
        <button
          className="course-card__wishlist"
          aria-label="Wishlist"
          onClick={e => { e.preventDefault(); e.stopPropagation(); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="course-card__body">
        <div className="course-card__cat">{category}</div>
        <h3 className="course-card__title">{title}</h3>
        <p className="course-card__instructor">by {instructor}</p>

        <div className="course-card__meta">
          <span className="course-card__stars">★★★★★</span>
          <span className="course-card__rating">{rating}</span>
          <span className="course-card__reviews">({reviewCount.toLocaleString()})</span>
          <span className="course-card__sep" />
          <span className="course-card__dur">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {duration}
          </span>
        </div>

        <div className="course-card__footer">
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span className={`course-card__price${isFree ? ' course-card__price--free' : ''}`}>
              {isFree ? 'Free' : `$${price}`}
            </span>
            {originalPrice && !isFree && (
              <span className="course-card__orig">${originalPrice}</span>
            )}
          </div>
          <span className="course-card__level">{level}</span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;

import { useEffect, useRef, useState } from 'react';
import './Reveal.css';

export default function Reveal({ children, className = '', delay = 0, threshold = 0.1, direction = 'up' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0,0,0) scale(1)';
    switch (direction) {
      case 'up': return 'translate3d(0, 40px, 0) scale(0.95)';
      case 'down': return 'translate3d(0, -40px, 0) scale(0.95)';
      case 'left': return 'translate3d(40px, 0, 0) scale(0.95)';
      case 'right': return 'translate3d(-40px, 0, 0) scale(0.95)';
      default: return 'translate3d(0, 40px, 0) scale(0.95)';
    }
  };

  return (
    <div
      ref={ref}
      className={`reveal-wrapper ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  );
}

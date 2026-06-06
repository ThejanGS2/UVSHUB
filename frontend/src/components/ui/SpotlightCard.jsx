import { useRef, useState } from 'react';
import './SpotlightCard.css';

export default function SpotlightCard({ children, className = '', glowColor = 'rgba(255, 255, 255, 0.15)' }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`spotlight-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--glow-color': glowColor }}
    >
      <div 
        className="spotlight-glow"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      />
      <div className="spotlight-content">
        {children}
      </div>
    </div>
  );
}

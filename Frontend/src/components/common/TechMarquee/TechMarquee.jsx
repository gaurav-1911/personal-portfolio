import React from 'react';
import { TECH_ITEMS } from './TechItems';
import './TechMarquee.css';

export const TechMarquee = () => {
  // Quadruple items to guarantee an uninterrupted, never-ending infinite marquee on all screen sizes
  const duplicatedItems = [
    ...TECH_ITEMS,
    ...TECH_ITEMS,
    ...TECH_ITEMS,
    ...TECH_ITEMS,
  ];

  return (
    <div className="tech-marquee-wrapper" aria-label="Core Technologies Section">
      <div className="tech-marquee-box">
        <div className="tech-marquee-header">
          <h2 className="tech-marquee-title">Core Technologies</h2>
          <p className="tech-marquee-subtitle">
            Hands-on experience working with and implementing these core technologies across real-world projects.
          </p>
          <div className="tech-marquee-accent-bar" aria-hidden="true" />
        </div>

        <div className="marquee-outer-container">
        <div className="marquee-track">
          {duplicatedItems.map((tech, index) => (
            <a
              key={`${tech.name}-${index}`}
              href={tech.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="marquee-item-card"
              data-tech={tech.name}
              title={`Open official ${tech.name} documentation`}
            >
              <span className="marquee-icon-box">{tech.icon}</span>
              <span className="marquee-tech-name">{tech.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export default TechMarquee;
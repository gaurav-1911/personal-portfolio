import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, AlertTriangle } from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import './NotFound.css';

export const NotFound = ({ isProject = false }) => {
  return (
    <div className="not-found-page">
      <SEOHead
        title="404 - Page Not Found | Gaurav Chavda"
        description="The page you requested could not be found. Return to Gaurav Chavda's portfolio homepage or explore projects."
        canonicalPath="/404"
        noIndex
      />

      <div className="not-found-container">
        <div className="not-found-icon-wrap">
          <AlertTriangle size={42} className="not-found-icon" />
        </div>

        <span className="not-found-code">404</span>

        <h1 className="not-found-title">
          {isProject ? 'Project Not Found' : 'Page Not Found'}
        </h1>

        <p className="not-found-description">
          {isProject
            ? 'The project deep-dive you are looking for does not exist or the URL slug has changed.'
            : 'The page you requested could not be found or may have been moved.'}
        </p>

        <div className="not-found-actions">
          <NavLink to="/" className="btn-primary not-found-btn">
            <Home size={16} />
            <span>Back to Home</span>
          </NavLink>
          <NavLink to="/projects" className="btn-secondary not-found-btn">
            <Compass size={16} />
            <span>Explore Projects</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import React from 'react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Gaurav Chavda. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

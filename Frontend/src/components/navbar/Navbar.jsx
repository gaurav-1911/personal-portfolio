import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle/ThemeToggle';
import { Menu, X, ArrowUpRight, FileDown } from 'lucide-react';
import './Navbar.css';

const NAV_ITEMS = [
  { name: 'About Me', path: '/' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'Projects', path: '/projects' },
  { name: 'Resume', path: '/resume' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', mobileMenuOpen);
    return () => {
      document.body.classList.remove('nav-menu-open');
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        {/* Brand */}
        <NavLink to="/" className="brand-logo" id="header-logo" aria-label="Gaurav Chavda Portfolio">
          <span className="logo-mark">
            <span className="logo-initials">GC</span>
          </span>
          <span className="logo-text">
            <span className="logo-firstname">Gaurav</span>
            <span className="logo-surname">Chavda</span>
          </span>
        </NavLink>

        {/* Center: Navigation Links */}
        <nav className="header-center" aria-label="Primary Navigation">
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: Actions */}
        <div className="header-right">
          <ThemeToggle />

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            id="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <div className="mobile-drawer-header">
          <span className="mobile-brand-title">
            Gaurav <span className="logo-surname">Chavda</span>
          </span>
          <button type="button" className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-nav-content">
          <ul className="mobile-nav-list">
            {NAV_ITEMS.map((item, i) => (
              <li key={item.path} className="mobile-nav-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  id={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="mobile-nav-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mobile-nav-name">{item.name}</span>
                  <ArrowUpRight size={16} className="mobile-nav-arrow" />
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mobile-resume-wrapper">
            <a
              href={`${import.meta.env.BASE_URL.replace(/\/+$/, '')}/Gaurav_Chavda_Mern_Stack_Resume.pdf`}
              download="Gaurav_Chavda_Mern_Stack_Resume.pdf"
              className="mobile-resume-download-btn"
              onClick={() => setMobileMenuOpen(false)}
              id="mobile-nav-resume-download"
            >
              <FileDown size={16} />
              <span>Download Resume (PDF)</span>
            </a>
          </div>
        </nav>

        <div className="mobile-drawer-footer">
          <div className="mobile-theme-row">
            <span className="mobile-theme-label">Appearance</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

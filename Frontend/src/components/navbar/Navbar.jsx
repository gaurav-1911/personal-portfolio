import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle/ThemeToggle';
import { Menu, X, User, FileText, Cpu, Briefcase, Layers, Mail } from 'lucide-react';
import './Navbar.css';
import './NavbarResponsive.css';

const NAV_ITEMS = [
  { name: 'About Me', path: '/', icon: <User size={18} /> },
  { name: 'Resume', path: '/resume', icon: <FileText size={18} /> },
  { name: 'Skills', path: '/skills', icon: <Cpu size={18} /> },
  { name: 'Experience', path: '/experience', icon: <Briefcase size={18} /> },
  { name: 'Projects', path: '/projects', icon: <Layers size={18} /> },
  { name: 'Contact Me', path: '/contact', icon: <Mail size={18} /> },
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

        {/* Center: Desktop Navigation Links */}
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
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            id="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div
        className={`mobile-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Dropdown Card */}
      <div className={`mobile-nav-dropdown-card ${mobileMenuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <nav className="mobile-dropdown-nav">
          <ul className="mobile-dropdown-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.path} className="mobile-dropdown-item">
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `mobile-dropdown-link ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  id={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-dropdown-name">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

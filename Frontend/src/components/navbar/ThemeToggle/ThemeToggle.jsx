import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../../context/useTheme';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      id="theme-toggle-btn"
    >
      <div className={`icon-container ${isDark ? 'is-dark' : 'is-light'}`}>
        <Sun className="theme-icon sun-icon" size={18} strokeWidth={2.2} />
        <Moon className="theme-icon moon-icon" size={18} strokeWidth={2.2} />
      </div>
      <span className="theme-status-glow"></span>
    </button>
  );
};

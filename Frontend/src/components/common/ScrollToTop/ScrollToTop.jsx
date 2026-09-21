/**
 * ScrollToTop: Resets the window scroll position to the top
 * whenever the route changes, so every page (About, Skills,
 * Experience, Projects, Resume, etc.) starts from the beginning.
 *
 * Uses `behavior: 'instant'` to bypass the global CSS
 * `scroll-behavior: smooth` so page switches jump immediately.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

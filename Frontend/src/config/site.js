/**
 * Site / deployment configuration.
 * Single source of truth for the canonical site origin, so no hard-coded
 * localhost values leak into SEO markup or structured data in production.
 *
 * Resolves to VITE_SITE_URL (set at build/deploy time) or, as a runtime
 * fallback, the browser's own origin (correct for any deployed host).
 */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '') ||
  'https://gauravchavdavhits.github.io/personal-portfolio-';

/** Normalize a path against the site origin (no trailing slash duplicates). */
export const absoluteUrl = (path = '/') => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
};
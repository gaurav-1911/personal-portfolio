/**
 * UrlNormalizer: Automatic Client-side URL Canonicalization.
 *
 * Enforces:
 * 1. Trailing slash normalization: e.g. `/projects/` -> `/projects`
 * 2. Casing normalization: e.g. `/PROJECTS` -> `/projects`
 * 3. Preserves all query parameters (e.g. `?utm_source=...`) during replace navigation
 * 4. Eliminates duplicate URL indexing penalties
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const UrlNormalizer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const rawPath = location.pathname;

    // Check if trailing slash exists (ignoring root `/`)
    const hasTrailingSlash = rawPath.length > 1 && rawPath.endsWith('/');
    // Check if path contains uppercase letters
    const hasUpperCase = /[A-Z]/.test(rawPath);

    if (hasTrailingSlash || hasUpperCase) {
      let normalizedPath = rawPath.toLowerCase();
      if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
        normalizedPath = normalizedPath.slice(0, -1);
      }

      // Perform clean replace navigation preserving search/query parameters and hash
      navigate(`${normalizedPath}${location.search}${location.hash}`, {
        replace: true,
      });
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  return null;
};

export default UrlNormalizer;

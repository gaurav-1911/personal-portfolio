/**
 * SEOHead: Lightweight, zero-dependency dynamic document head & structured data manager.
 * Updates page title, meta description, canonical link, Open Graph, Twitter cards,
 * and injects Schema.org JSON-LD on route changes.
 */
import { useEffect } from 'react';
import { SITE_URL } from '../../../config/site';

export const SEOHead = ({
  title = 'Gaurav Chavda | MERN Stack Developer & Software Engineer',
  description = 'Portfolio of Gaurav Chavda — MERN Stack Developer specializing in React.js, Node.js, Express.js, MongoDB, scalable REST APIs, and modern web architectures.',
  canonicalPath = '/',
  ogImage = '/developer_portrait.jpg',
  ogType = 'website',
  schema = null,
  noIndex = false,
}) => {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Helper to set or create a <meta> tag
    const setMeta = (attr, key, content) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Update Robots Meta Tag (Enforces noindex on private/admin routes)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. Update Standard Meta Description
    setMeta('name', 'description', description);

    // 5. Update Canonical Link Tag (Normalized: lowercased, no trailing slash, no query strings)
    const cleanPath = canonicalPath.split('?')[0].split('#')[0].toLowerCase();
    const normalizedPath = cleanPath.length > 1 && cleanPath.endsWith('/')
      ? cleanPath.slice(0, -1)
      : cleanPath;
    const fullCanonicalUrl = `${SITE_URL}${normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 5. Update Open Graph Meta Tags
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullCanonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:image', `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`);

    // 6. Update Twitter Card Meta Tags
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`);

    // 7. Inject Schema.org JSON-LD Structured Data
    const scriptId = 'schema-structured-data';
    let scriptElement = document.getElementById(scriptId);

    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = scriptId;
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    // Cleanup on unmount / navigation
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, [title, description, canonicalPath, ogImage, ogType, schema, noIndex]);

  return null;
};

export default SEOHead;

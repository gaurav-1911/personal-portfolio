/**
 * Route prefetching utility for instant, zero-delay page transitions.
 * Pre-caches lazy route modules during idle time and on hover/focus.
 */

export const prefetchRoute = (path) => {
  if (!path) return;
  const cleanPath = path.toLowerCase().trim();

  switch (cleanPath) {
    case '/resume':
      return import('../pages/public/Resume/Resume');
    case '/projects':
      return import('../pages/public/Projects/Projects');
    case '/skills':
      return import('../pages/public/Skills/Skills');
    case '/experience':
    case '/journey':
      return import('../pages/public/Experience/Experience');
    case '/about':
      return import('../pages/public/About/About');
    case '/contact':
      return import('../pages/public/Contact/Contact');
    case '/':
      return import('../pages/public/Home/Home');
    default:
      if (cleanPath.startsWith('/projects/')) {
        return import('../pages/public/ProjectDetails/ProjectDetails');
      }
      return null;
  }
};

/**
 * Silently warms up other page chunks during browser idle time
 * so any user click renders instantly with 0ms delay.
 */
export const prefetchAllRoutesIdle = () => {
  if (typeof window === 'undefined') return () => {};

  const scheduleIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));
  const cancelIdle = window.cancelIdleCallback || clearTimeout;

  const handle = scheduleIdle(() => {
    import('../pages/public/Projects/Projects');
    import('../pages/public/Resume/Resume');
    import('../pages/public/Skills/Skills');
    import('../pages/public/Experience/Experience');
    import('../pages/public/Contact/Contact');
    import('../pages/public/About/About');
    import('../pages/public/ProjectDetails/ProjectDetails');
  });

  return () => cancelIdle(handle);
};

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppRoutes } from './routes/AppRoutes';
import api from './services/api';

import { prefetchAllRoutesIdle } from './utils/routePrefetch';

function App() {
  useEffect(() => {
    // Silently warm up routes during idle time so page switching is instant
    const cancelPrefetch = prefetchAllRoutesIdle();

    // Silently ping health check on load to wake up free-tier backend if sleeping
    api.get('/health').catch(() => {
      // Ignore background wake-up errors
    });

    return () => {
      if (typeof cancelPrefetch === 'function') cancelPrefetch();
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

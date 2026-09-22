import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AppRoutes } from './routes/AppRoutes';
import api from './services/api';

function App() {
  useEffect(() => {
    // Silently ping health check on load to wake up free-tier backend if sleeping
    api.get('/health').catch(() => {
      // Ignore background wake-up errors
    });
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

import axios from 'axios';

// Production uses a relative /api/v1 base (same origin behind a reverse proxy
// or CDN). Development overrides it with an absolute URL or via the Vite proxy.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach admin/auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for normalized error payloads
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'Request timed out. Please try again.'
        : error.message || 'An unexpected error occurred');
    const customError = new Error(message);
    customError.status = error.response?.status ?? 0;
    customError.errors = error.response?.data?.errors || [];
    return Promise.reject(customError);
  }
);

/**
 * Creates an AbortController instance for cancelling ongoing API requests
 * during search input debouncing or component unmounting.
 */
export const createCancelToken = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    abort: () => controller.abort(),
  };
};

export default api;

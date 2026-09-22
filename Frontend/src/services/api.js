import axios from 'axios';

// Production uses a relative /api/v1 base (same origin behind a reverse proxy
// or CDN). Development overrides it with an absolute URL or via the Vite proxy.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000,
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

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = error.response?.data?.message;
    if (!message) {
      if (error.code === 'ECONNABORTED') {
        message = 'Server response took longer than expected (backend may be spinning up from sleep). Please wait a moment or reach out directly at gauravbhai1911@gmail.com.';
      } else if (error.response?.status === 404) {
        message = 'Backend API service is currently offline. Please reach out directly via email at gauravbhai1911@gmail.com.';
      } else if (!error.response) {
        message = 'Unable to reach backend server. Please reach out directly via email at gauravbhai1911@gmail.com or LinkedIn.';
      } else {
        message = error.message || 'An unexpected error occurred';
      }
    }
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

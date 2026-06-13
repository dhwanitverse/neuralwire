import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message =
        error.code === 'ECONNABORTED'
          ? 'Request timed out. The server may still be starting — wait until the terminal shows "Server running on port 5000", then try again.'
          : 'Cannot reach the API server. Run `npm run dev` from the project root and wait until the backend is ready.';
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }
    return Promise.reject(error);
  }
);

export default api;

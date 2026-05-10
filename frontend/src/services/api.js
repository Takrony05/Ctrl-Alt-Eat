import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kds_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear the token so future requests (like public menu) work
      localStorage.removeItem('kds_token');
      // Optional: redirect to login if not already there
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const signup = (data) => api.post('/auth/signup/', data);
export const login  = (data) => api.post('/auth/login/', data);
export const logout = ()     => api.post('/auth/logout/');
export const getMe  = ()     => api.get('/auth/me/');

// ── Menu ──────────────────────────────────────────────────
export const getMenuItems = () => api.get('/menu-items/');

// ── Orders ────────────────────────────────────────────────
export const getOrders        = ()           => api.get('/orders/');
export const getOrderById     = (id)         => api.get(`/orders/${id}/`);
export const placeOrder       = (data)       => api.post('/orders/', data);
export const updateOrderStatus = (id, data)  => api.patch(`/orders/${id}/`, data);

// ── Dashboard ─────────────────────────────────────────────
export const getDashboard = () => api.get('/dashboard/');

// Compatibility alias for order_tracking-feat
export const orderAPI = {
  create: placeOrder,
  getById: getOrderById,
};

export default api;

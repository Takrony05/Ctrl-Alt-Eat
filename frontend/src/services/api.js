import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const orderAPI = {
  /** POST /api/orders/ */
  create: (payload) => api.post('/orders/', payload),

  /** GET /api/orders/{id}/ */
  getById: (id) => api.get(`/orders/${id}/`),
};

export default api;

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOrders = () => api.get('/orders/');
export const createOrder = (orderData) => api.post('/orders/', orderData);
export const updateOrderStatus = (orderId, status) => api.patch(`/orders/${orderId}/`, { status });

export default api;

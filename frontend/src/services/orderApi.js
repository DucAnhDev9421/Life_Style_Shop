import api from './api';

export const orderApi = {
  getOrders: () => api.get('/orders'),
};

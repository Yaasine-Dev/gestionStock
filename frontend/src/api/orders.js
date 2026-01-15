import api from './axios';

export const ordersAPI = {
  getAll: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },

  create: async (orderData) => {
    const response = await api.post('/orders/', orderData);
    return response.data;
  },

  update: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  }
};
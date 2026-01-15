import api from './axios';

export const movementsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/stock/', { params });
    return response.data;
  },

  getByProduct: async (productId) => {
    const response = await api.get(`/stock/product/${productId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/stock/', data);
    return response.data;
  }
};
import api from './axios';

export const stockApi = {
  getAll: async () => {
    const response = await api.get('/stock/');
    return response.data;
  },
  
  getByProductId: async (productId) => {
    const response = await api.get(`/stock/product/${productId}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/stock/', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/stock/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    await api.delete(`/stock/${id}`);
    return true;
  },
  
  addStock: async (productId, quantity, location = null) => {
    const response = await api.post('/stock/add', {
      product_id: productId,
      quantity,
      location,
      movement_type: 'IN'
    });
    return response.data;
  },
  
  removeStock: async (productId, quantity, location = null) => {
    const response = await api.post('/stock/remove', {
      product_id: productId,
      quantity,
      location,
      movement_type: 'OUT'
    });
    return response.data;
  }
};
import api from './axios';

export const stockEvolutionAPI = {
  getStockEvolution: async (months = 6) => {
    try {
      const response = await api.get(`/stock/evolution?months=${months}`);
      return response.data;
    } catch (error) {
      // Fallback to mock data if API not available
      const now = new Date();
      const mockData = [];
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
        
        // Generate realistic stock evolution data
        const baseValue = 150000 + (Math.random() - 0.5) * 30000;
        const trend = i < months / 2 ? 1.05 : 0.98; // Growth then slight decline
        const value = Math.round(baseValue * Math.pow(trend, i));
        
        mockData.push({
          month: monthName,
          value: value,
          date: date.toISOString().split('T')[0]
        });
      }
      
      return mockData;
    }
  }
};
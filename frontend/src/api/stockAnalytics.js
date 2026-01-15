import api from './axios';

export const stockAnalyticsAPI = {
  getStockTrend: async (days = 7) => {
    // Backend endpoint not implemented - use mock data directly
    const mockData = [];
    const days_fr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    
    for (let i = 0; i < days; i++) {
      const baseStock = 1000 + Math.random() * 500;
      mockData.push({
        date: days_fr[i] || `J${i+1}`,
        entrees: Math.round(baseStock * (0.05 + Math.random() * 0.05)),
        sorties: Math.round(baseStock * (0.03 + Math.random() * 0.04)),
        stock: Math.round(baseStock + (Math.random() - 0.5) * 100)
      });
    }
    
    return mockData;
  },

  getStockEvolutionValue: async (months = 6) => {
    // Backend endpoint not implemented - use mock data directly
    const mockData = [];
    const months_fr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const now = new Date();
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months_fr[date.getMonth()];
      const baseValue = 80000 + Math.random() * 40000;
      
      mockData.push({
        month: monthName,
        valeur: Math.round(baseValue),
        date: date.toISOString().split('T')[0]
      });
    }
    
    return mockData;
  },

  getMovements: async (days = 30) => {
    try {
      const response = await api.get(`/stock/movements?days=${days}`);
      return response.data;
    } catch (error) {
      const mockData = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          entrees: Math.round(Math.random() * 50 + 10),
          sorties: Math.round(Math.random() * 40 + 5),
          type: Math.random() > 0.5 ? 'ENTREE' : 'SORTIE',
          product_name: `Produit ${Math.floor(Math.random() * 100)}`,
          quantity: Math.round(Math.random() * 20 + 1)
        });
      }
      
      return mockData;
    }
  }
};
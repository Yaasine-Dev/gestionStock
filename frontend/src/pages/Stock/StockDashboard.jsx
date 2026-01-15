import React, { useState, useEffect } from 'react';
import { FaBox, FaHistory, FaChartLine, FaExclamationTriangle, FaEdit } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { productsAPI } from '../../api/products';
import { stockAnalyticsAPI } from '../../api/stockAnalytics';
import { movementsAPI } from '../../api/movements';
import StockList from './StockList';
import StockMovements from './StockMovements';
import AddStock from './AddStock';

export default function StockDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    stockValue: 0,
    todayMovements: 0,
    categoryData: [],
    totalStock: 0,
    stockTrendData: [],
    monthlyData: []
  });

  useEffect(() => {
    fetchStockData();
  }, [activeTab]);

  const fetchStockData = async () => {
    try {
      const [products, stockTrend, stockEvolution, movements] = await Promise.all([
        productsAPI.getAll(),
        stockAnalyticsAPI.getStockTrend(7),
        stockAnalyticsAPI.getStockEvolutionValue(6),
        movementsAPI.getAll()
      ]);
      
      const totalItems = products.length;
      const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
      const lowStock = products.filter(p => p.quantity < 10 && p.quantity > 0).length;
      const stockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0);

      // Count today's movements
      const today = new Date().toDateString();
      const todayMovements = movements.filter(m => 
        new Date(m.movement_date).toDateString() === today
      ).length;

      const categoryGroups = products.reduce((acc, product) => {
        const category = product.category_name || product.category || 'Autres';
        if (!acc[category]) acc[category] = { count: 0, value: 0 };
        acc[category].count += product.quantity || 0;
        acc[category].value += (product.price || 0) * (product.quantity || 0);
        return acc;
      }, {});

      const categoryData = Object.entries(categoryGroups).map(([name, data]) => ({
        name,
        stock: data.count,
        value: data.value
      }));

      setStats({
        totalItems,
        lowStock,
        stockValue,
        todayMovements,
        categoryData,
        totalStock,
        stockTrendData: stockTrend || [],
        monthlyData: stockEvolution || []
      });
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const handleStockChange = () => {
    fetchStockData();
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (activeTab === 'movements') {
      setRefreshKey(prev => prev + 1);
    }
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    fetchStockData();
  };

  const tabs = [
    { id: 'inventory', label: 'Inventaire', icon: FaBox, component: StockList },
    { id: 'movements', label: 'Mouvements', icon: FaHistory, component: StockMovements },
    { id: 'analytics', label: 'Analyses', icon: FaChartLine, component: null },
  ];



  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Stats */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Stock</h1>
              <p className="text-gray-600">Vue d'ensemble de votre inventaire</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FaBox className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">Total Articles</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FaExclamationTriangle className="text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-600">Stock Faible</p>
                  <p className="text-2xl font-bold text-red-900">{stats.lowStock}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaChartLine className="text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Valeur Stock</p>
                  <p className="text-2xl font-bold text-green-900">{stats.stockValue.toLocaleString()} DH</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FaHistory className="text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">Mouvements Aujourd'hui</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.todayMovements}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'analytics' ? (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendance du Stock (7 jours)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.stockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="entrees" stroke="#10b981" strokeWidth={3} name="Entrées" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="sorties" stroke="#ef4444" strokeWidth={3} name="Sorties" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="stock" stroke="#3b82f6" strokeWidth={3} name="Stock Total" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock par Catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="stock" fill="#3b82f6" name="Quantité" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Valeur du Stock (6 mois)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k DH`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value) => [`${value.toLocaleString()} DH`, 'Valeur']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="valeur" 
                    fill="url(#barGradient)" 
                    name="Valeur (DH)" 
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : activeTab === 'inventory' ? (
          <StockList key={refreshKey} onStockChange={handleStockChange} />
        ) : activeTab === 'movements' ? (
          <StockMovements key={refreshKey} refreshTrigger={refreshKey} />
        ) : null}
      </div>
    </div>
  );
}
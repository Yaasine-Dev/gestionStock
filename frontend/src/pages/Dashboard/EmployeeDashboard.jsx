import React, { useState, useEffect } from "react";
import { productsAPI } from "../../api/products";
import { FaBox, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export default function EmployeeDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const lowStock = products.filter(p => p.quantity < 10 && p.quantity > 0).length;
  const stockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0);

  const statsCards = [
    { title: "Total Produits", value: totalProducts, icon: FaBox, color: "blue" },
    { title: "Stock Total", value: totalStock, icon: FaCheckCircle, color: "green" },
    { title: "Valeur Stock", value: `${stockValue.toLocaleString('fr-FR')} DH`, icon: FaExclamationTriangle, color: "amber" },
    { title: "Stock Faible", value: lowStock, icon: FaTimesCircle, color: "red" },
  ];

  // Prepare chart data - Top 10 products by stock
  const stockData = products
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: p.quantity,
      color: p.quantity === 0 ? '#ef4444' : p.quantity < 10 ? '#f59e0b' : '#10b981'
    }));

  const stockStatusData = [
    { name: 'Disponible', value: products.filter(p => p.quantity >= 10).length, color: '#10b981' },
    { name: 'Stock Faible', value: lowStock, color: '#f59e0b' },
    { name: 'Rupture', value: outOfStock, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-${card.color}-100`}>
                  <Icon className={`h-6 w-6 text-${card.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {lowStock > 0 && (
        <div className="card border-l-4 border-amber-500 bg-amber-50 p-4">
          <div className="flex items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 mr-3 flex-shrink-0">
              <FaExclamationTriangle className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">Alerte Stock Faible</h3>
              <p className="text-sm text-amber-700 mt-1">
                {lowStock} produit(s) ont un stock inférieur à 10 unités.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Chart - Bar */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Top 10 Produits par Stock</h3>
          {stockData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="stock" radius={[0, 8, 8, 0]}>
                  {stockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-slate-400">
              <p>Aucun produit disponible</p>
            </div>
          )}
        </div>

        {/* Stock Status - Pie Chart */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Répartition du Stock</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stockStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Trend - Line Chart */}
        <div className="card p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Tendance Stock (7j)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { jour: 'Lun', stock: totalStock * 0.90 },
              { jour: 'Mar', stock: totalStock * 0.93 },
              { jour: 'Mer', stock: totalStock * 0.87 },
              { jour: 'Jeu', stock: totalStock * 0.95 },
              { jour: 'Ven', stock: totalStock * 0.98 },
              { jour: 'Sam', stock: totalStock },
              { jour: 'Dim', stock: totalStock * 1.03 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="jour" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line type="monotone" dataKey="stock" stroke="#06b6d4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Produits Récents</h3>
        </div>
        <div className="overflow-x-auto" style={{ maxHeight: '340px' }}>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Produit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Prix</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {products.slice(0, 10).map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="h-8 w-8 rounded-lg object-cover mr-3 border border-gray-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 mr-3" style={{ display: product.image_url ? 'none' : 'flex' }}>
                        <span className="text-blue-600 font-semibold text-xs">{product.name.charAt(0)}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-900">
                    {product.price?.toLocaleString('fr-FR')} DH
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-900">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {product.quantity === 0 ? (
                      <span className="badge bg-red-100 text-red-700">
                        Rupture
                      </span>
                    ) : product.quantity < 10 ? (
                      <span className="badge bg-amber-100 text-amber-700">
                        Faible
                      </span>
                    ) : (
                      <span className="badge bg-green-100 text-green-700">
                        Disponible
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

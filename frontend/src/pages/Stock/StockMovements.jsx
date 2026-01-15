import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaCalendar, FaUser, FaBox } from 'react-icons/fa';
import { movementsAPI } from '../../api/movements';

export default function StockMovements({ refreshTrigger }) {
  const [movements, setMovements] = useState([]);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, [refreshTrigger]);

  const loadMovements = async () => {
    try {
      setLoading(true);
      const data = await movementsAPI.getAll();
      console.log('Movements loaded:', data);
      setMovements(data || []);
      setFilteredMovements(data || []);
    } catch (error) {
      console.error('Error loading movements:', error);
      setMovements([]);
      setFilteredMovements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = movements;

    if (dateFilter) {
      filtered = filtered.filter(movement => 
        movement.movement_date.startsWith(dateFilter)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(movement => movement.type === typeFilter);
    }

    setFilteredMovements(filtered);
  }, [dateFilter, typeFilter, movements]);

  const getMovementIcon = (type) => {
    const normalizedType = type.toUpperCase();
    return normalizedType === 'IN' ? 
      <FaArrowUp className="text-green-500" /> : 
      <FaArrowDown className="text-red-500" />;
  };

  const getMovementColor = (type) => {
    const normalizedType = type.toUpperCase();
    return normalizedType === 'IN' ? 
      'bg-green-100 text-green-800' : 
      'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mouvements de Stock</h1>
        <p className="text-gray-600">Historique des entrées et sorties de stock</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="in">Entrées</option>
              <option value="out">Sorties</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredMovements.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun mouvement trouvé</h3>
            <p className="text-gray-500">Aucun mouvement ne correspond à vos critères</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaBox className="text-blue-600 text-sm" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{movement.product_name}</div>
                          <div className="text-sm text-gray-500">SKU: {movement.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMovementIcon(movement.type)}
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementColor(movement.type)}`}>
                          {movement.type.toUpperCase() === 'IN' ? 'Entrée' : 'Sortie'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{movement.quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCalendar className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(movement.movement_date).toLocaleDateString('fr-FR')} à {new Date(movement.movement_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
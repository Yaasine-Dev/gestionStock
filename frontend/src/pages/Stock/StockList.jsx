import React, { useState, useEffect } from 'react';
import { FaBox, FaPlus, FaSearch, FaFilter, FaExclamationTriangle, FaArrowUp, FaArrowDown, FaEdit, FaEye, FaTimes, FaMinus } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { productsAPI } from '../../api/products';
import { stockApi } from '../../api/stock';
import { showToast } from '../../components/toast';

export default function StockList({ onStockChange }) {
  const { user } = useAuth();
  const [stockItems, setStockItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [adjustData, setAdjustData] = useState({ quantity: '', movementType: 'IN', selectedProduct: null, searchTerm: '', filteredProducts: [] });
  const [loading, setLoading] = useState(false);

  const canModify = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const products = await productsAPI.getAll();
      const stockData = products.map(product => {
        const status = product.quantity === 0 ? 'out' : product.quantity < 10 ? 'low' : product.quantity > 50 ? 'high' : 'normal';
        return {
          id: product.id,
          productName: product.name,
          sku: product.sku || 'N/A',
          currentStock: product.quantity,
          minStock: 10,
          maxStock: 50,
          lastUpdated: new Date().toISOString().split('T')[0],
          status,
          price: product.price,
          description: product.description || 'Aucune description',
          category: product.category_name || 'Non catégorisé',
          supplier: product.supplier_name || 'Non défini',
          image_url: product.image_url || null
        };
      });
      setStockItems(stockData);
      setFilteredItems(stockData);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    let filtered = stockItems.filter(item =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredItems(filtered);
  }, [searchTerm, statusFilter, stockItems]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'out': return 'bg-gray-100 text-gray-800';
      case 'low': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'out': return <FaExclamationTriangle className="text-gray-500" />;
      case 'low': return <FaExclamationTriangle className="text-red-500" />;
      case 'high': return <FaArrowUp className="text-yellow-500" />;
      case 'normal': return <FaBox className="text-green-500" />;
      default: return <FaBox className="text-gray-500" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const quantity = parseInt(formData.get('currentStock'));
    
    try {
      if (editingItem) {
        const diff = quantity - editingItem.currentStock;
        if (diff > 0) {
          await stockApi.addStock(editingItem.id, diff);
        } else if (diff < 0) {
          await stockApi.removeStock(editingItem.id, Math.abs(diff));
        }
      }
      setShowModal(false);
      setEditingItem(null);
      fetchStockData();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Erreur lors de la mise à jour du stock');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Stock</h1>
          <p className="text-gray-600">Gérez vos niveaux de stock et emplacements</p>
        </div>
        {canModify && (
          <button
            onClick={() => setShowAdjustModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPlus /> Ajuster Stock
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="out">Rupture de stock</option>
              <option value="low">Stock faible</option>
              <option value="normal">Stock normal</option>
              <option value="high">Stock élevé</option>
            </select>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Réinitialiser le filtre"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FaBox className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
            <p className="text-gray-500">Ajustez vos filtres ou ajoutez de nouveaux articles</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actuel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limites</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  {canModify && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center" style={{ display: item.image_url ? 'none' : 'flex' }}>
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                          <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.currentStock}</div>
                      <div className="text-sm text-gray-500">Mis à jour: {new Date(item.lastUpdated).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Min: {item.minStock}</div>
                      <div className="text-sm text-gray-900">Max: {item.maxStock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status === 'out' ? 'Rupture' : item.status === 'low' ? 'Stock faible' : item.status === 'high' ? 'Stock élevé' : 'Normal'}
                      </span>
                    </td>
                    {canModify && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => {
                              setViewingItem(item);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Voir les détails"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingItem(item);
                              setShowModal(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Ajuster le stock"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Ajuster le stock' : 'Nouveau stock'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                <input
                  type="text"
                  name="productName"
                  disabled
                  defaultValue={editingItem?.productName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  disabled
                  defaultValue={editingItem?.sku || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock actuel *</label>
                  <input
                    type="number"
                    name="currentStock"
                    required
                    defaultValue={editingItem?.currentStock || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire</label>
                  <input
                    type="number"
                    disabled
                    defaultValue={editingItem?.price || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  Stock actuel: <strong>{editingItem?.currentStock || 0}</strong> unités
                </p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Ajuster le Stock</h2>
                <button
                  onClick={() => {
                    setShowAdjustModal(false);
                    setAdjustData({ quantity: '', movementType: 'IN', selectedProduct: null, searchTerm: '', filteredProducts: [] });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!adjustData.selectedProduct) {
                showToast('Veuillez sélectionner un produit', { type: 'error' });
                return;
              }
              if (!adjustData.quantity || parseInt(adjustData.quantity) <= 0) {
                showToast('Veuillez saisir une quantité valide', { type: 'error' });
                return;
              }
              
              setLoading(true);
              try {
                const quantityNum = parseInt(adjustData.quantity);
                if (adjustData.movementType === 'IN') {
                  await stockApi.addStock(adjustData.selectedProduct.id, quantityNum, null);
                  showToast(`${quantityNum} unités ajoutées au stock de ${adjustData.selectedProduct.productName}`, { type: 'success' });
                } else {
                  await stockApi.removeStock(adjustData.selectedProduct.id, quantityNum, null);
                  showToast(`${quantityNum} unités retirées du stock de ${adjustData.selectedProduct.productName}`, { type: 'success' });
                }
                setShowAdjustModal(false);
                setAdjustData({ quantity: '', movementType: 'IN', selectedProduct: null, searchTerm: '', filteredProducts: [] });
                fetchStockData();
                if (onStockChange) onStockChange();
              } catch (error) {
                const errorMsg = error.response?.data?.detail || 'Erreur lors de l\'ajustement du stock';
                showToast(errorMsg, { type: 'error' });
              } finally {
                setLoading(false);
              }
            }} className="p-6 space-y-4">
              
              {/* Product Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher un produit</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={adjustData.searchTerm || ''}
                    onChange={(e) => {
                      const searchTerm = e.target.value;
                      setAdjustData(prev => ({ ...prev, searchTerm }));
                      if (searchTerm) {
                        const filtered = stockItems.filter(item =>
                          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toString().includes(searchTerm)
                        );
                        setAdjustData(prev => ({ ...prev, filteredProducts: filtered }));
                      } else {
                        setAdjustData(prev => ({ ...prev, filteredProducts: [] }));
                      }
                    }}
                    placeholder="Nom du produit ou ID..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {/* Search Results */}
                  {adjustData.filteredProducts && adjustData.filteredProducts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {adjustData.filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setAdjustData(prev => ({
                              ...prev,
                              selectedProduct: product,
                              searchTerm: product.productName,
                              filteredProducts: []
                            }));
                          }}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{product.productName}</p>
                              <p className="text-sm text-gray-500">ID: {product.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">Stock: {product.currentStock}</p>
                              <p className="text-sm text-gray-500">{product.price} DH</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Product */}
              {adjustData.selectedProduct && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-blue-900">{adjustData.selectedProduct.productName}</h3>
                      <p className="text-sm text-blue-700">ID: {adjustData.selectedProduct.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-blue-900">Stock: {adjustData.selectedProduct.currentStock}</p>
                      <p className="text-sm text-blue-700">{adjustData.selectedProduct.price} DH</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Movement Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de mouvement</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAdjustData(prev => ({ ...prev, movementType: 'IN' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      adjustData.movementType === 'IN'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaPlus className="mx-auto mb-2" />
                    <p className="font-medium">Entrée</p>
                    <p className="text-sm">Ajouter au stock</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAdjustData(prev => ({ ...prev, movementType: 'OUT' }))}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      adjustData.movementType === 'OUT'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FaMinus className="mx-auto mb-2" />
                    <p className="font-medium">Sortie</p>
                    <p className="text-sm">Retirer du stock</p>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                <input
                  type="number"
                  value={adjustData.quantity}
                  onChange={(e) => setAdjustData(prev => ({ ...prev, quantity: e.target.value }))}
                  min="1"
                  placeholder="Entrez la quantité"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setAdjustData({ quantity: '', movementType: 'IN', selectedProduct: null, searchTerm: '', filteredProducts: [] });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || !adjustData.selectedProduct}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    adjustData.movementType === 'IN'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </div>
                  ) : (
                    `${adjustData.movementType === 'IN' ? 'Ajouter' : 'Retirer'} ${adjustData.quantity || '0'} unité(s)`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && viewingItem && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Détails du Stock</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setViewingItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Info with Image */}
              <div className="flex items-start space-x-4">
                {viewingItem.image_url ? (
                  <img 
                    src={viewingItem.image_url} 
                    alt={viewingItem.productName}
                    className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    {getStatusIcon(viewingItem.status)}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{viewingItem.productName}</h3>
                  <p className="text-sm text-gray-500 mt-1">SKU: {viewingItem.sku}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingItem.status)}`}>
                  {viewingItem.status === 'out' ? 'Rupture' : viewingItem.status === 'low' ? 'Stock faible' : viewingItem.status === 'high' ? 'Stock élevé' : 'Normal'}
                </span>
              </div>

              {/* Stock Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Stock Actuel</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{viewingItem.currentStock}</p>
                  <p className="text-xs text-blue-600 mt-1">unités</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Stock Min</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{viewingItem.minStock}</p>
                  <p className="text-xs text-green-600 mt-1">unités</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-xs font-medium text-yellow-600 uppercase tracking-wide">Stock Max</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">{viewingItem.maxStock}</p>
                  <p className="text-xs text-yellow-600 mt-1">unités</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Prix Unitaire</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{viewingItem.price}</p>
                  <p className="text-xs text-purple-600 mt-1">DH</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBox className="text-gray-600" />
                    <p className="text-sm font-semibold text-gray-700">Catégorie</p>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{viewingItem.category}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaArrowUp className="text-gray-600" />
                    <p className="text-sm font-semibold text-gray-700">Fournisseur</p>
                  </div>
                  <p className="text-lg font-medium text-gray-900">{viewingItem.supplier}</p>
                </div>
              </div>

              {/* Description */}
              {viewingItem.description && viewingItem.description !== 'Aucune description' && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                  <p className="text-sm text-gray-600">{viewingItem.description}</p>
                </div>
              )}

              {/* Last Update */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FaArrowUp className="text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700">Dernière Mise à Jour</p>
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(viewingItem.lastUpdated).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Stock Value */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">Valeur Totale du Stock</p>
                    <p className="text-3xl font-bold text-indigo-900 mt-1">
                      {(viewingItem.currentStock * viewingItem.price).toLocaleString()} DH
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-indigo-600">Disponibilité</p>
                    <div className="mt-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min((viewingItem.currentStock / viewingItem.maxStock) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-indigo-600 mt-1">
                        {Math.round((viewingItem.currentStock / viewingItem.maxStock) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setViewingItem(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
                {canModify && (
                  <button
                    onClick={() => {
                      setEditingItem(viewingItem);
                      setShowDetailsModal(false);
                      setShowModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Ajuster le Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
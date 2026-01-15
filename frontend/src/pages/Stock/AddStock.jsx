import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../api/products';
import { stockApi } from '../../api/stock';
import { showToast } from '../../components/toast';
import { FaPlus, FaMinus, FaSearch, FaBox } from 'react-icons/fa';

export default function AddStock() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [movementType, setMovementType] = useState('IN');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data || []);
    } catch (error) {
      showToast('Erreur lors du chargement des produits', { type: 'error' });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setSearchTerm(product.name);
    setFilteredProducts([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      showToast('Veuillez sélectionner un produit', { type: 'error' });
      return;
    }
    
    if (!quantity || parseInt(quantity) <= 0) {
      showToast('Veuillez saisir une quantité valide', { type: 'error' });
      return;
    }

    setLoading(true);
    
    try {
      const quantityNum = parseInt(quantity);
      
      if (movementType === 'IN') {
        await stockApi.addStock(selectedProduct.id, quantityNum, location || null);
        showToast(`${quantityNum} unités ajoutées au stock de ${selectedProduct.name}`, { type: 'success' });
      } else {
        await stockApi.removeStock(selectedProduct.id, quantityNum, location || null);
        showToast(`${quantityNum} unités retirées du stock de ${selectedProduct.name}`, { type: 'success' });
      }
      
      // Reset form
      setSelectedProduct(null);
      setSearchTerm('');
      setQuantity('');
      setLocation('');
      
      // Reload products to get updated quantities
      loadProducts();
      
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Erreur lors de l\'ajustement du stock';
      showToast(errorMsg, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FaBox className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ajuster le Stock</h2>
            <p className="text-sm text-gray-600">Ajouter ou retirer des articles du stock</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher un produit
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom du produit ou ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {/* Search Results Dropdown */}
              {filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Stock: {product.quantity || 0}</p>
                          <p className="text-sm text-gray-500">{product.price} DH</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Product Display */}
          {selectedProduct && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-blue-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-blue-700">ID: {selectedProduct.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-900">Stock actuel: {selectedProduct.quantity || 0}</p>
                  <p className="text-sm text-blue-700">{selectedProduct.price} DH</p>
                </div>
              </div>
            </div>
          )}

          {/* Movement Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de mouvement
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMovementType('IN')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  movementType === 'IN'
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
                onClick={() => setMovementType('OUT')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  movementType === 'OUT'
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantité
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              placeholder="Entrez la quantité"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Location (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emplacement (optionnel)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: Entrepôt A, Rayon B..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !selectedProduct}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              movementType === 'IN'
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
              `${movementType === 'IN' ? 'Ajouter' : 'Retirer'} ${quantity || '0'} unité(s)`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
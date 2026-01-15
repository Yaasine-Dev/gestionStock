import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../api/products';
import { categoriesApi } from '../../api/categories';
import { uploadAPI } from '../../api/upload';
import { showToast } from '../../components/toast';
import Swal from 'sweetalert2';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll(),
        categoriesApi.getAll()
      ]);
      setProducts(productsRes || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      showToast('Erreur lors du chargement des données', { type: 'error' });
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner une image', { type: 'error' });
      return;
    }
    
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    
    try {
      const result = await uploadAPI.uploadImage(file);
      return `http://localhost:8000${result.url}`;
    } catch (error) {
      showToast('Erreur lors du téléchargement', { type: 'error' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleQuickAdd = async (productData) => {
    try {
      await productsAPI.create(productData);
      await Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Produit créé avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      loadData();
      setShowQuickAddModal(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.detail || 'Erreur lors de la création'
      });
    }
  };

  const handleUpdate = async (productData) => {
    try {
      await productsAPI.update(editingProduct.id, productData);
      await Swal.fire({
        icon: 'success',
        title: 'Succès!',
        text: 'Produit modifié avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      loadData();
      setShowEditModal(false);
      setEditingProduct(null);
      setImagePreview(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response?.data?.detail || 'Erreur lors de la modification'
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#26d935',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await productsAPI.delete(id);
      await Swal.fire({
        icon: 'success',
        title: 'Supprimé!',
        text: 'Produit supprimé avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      loadData();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la suppression'
      });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sans catégorie';
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Produits</h1>
          <p className="mt-1 text-sm text-slate-600">Gérez votre inventaire de produits</p>
        </div>
        <button
          onClick={() => setShowQuickAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Nouveau produit</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Produits</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{products.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Stock Total</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{products.reduce((sum, p) => sum + (p.quantity || 0), 0)}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Catégories</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{categories.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Valeur Stock</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{products.reduce((sum, p) => sum + (p.price * p.quantity || 0), 0).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">Aucun produit</h3>
            <p className="mt-1 text-sm text-slate-500">Commencez par créer un nouveau produit</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Produit</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Catégorie</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Prix</th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Stock</th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="h-10 w-10 flex-shrink-0 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100" style={{ display: product.image_url ? 'none' : 'flex' }}>
                          <span className="text-sm font-semibold text-blue-600">
                            {product.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500">{product.sku || `ID: ${product.id}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="badge bg-slate-100 text-slate-700">
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{product.price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`badge ${
                        product.quantity > 10 ? 'bg-green-100 text-green-700' : 
                        product.quantity > 0 ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {product.quantity || 0}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowEditModal(true);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="Modifier"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Supprimer"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Nouveau Produit</h2>
                <button 
                  onClick={() => setShowQuickAddModal(false)}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const imageUrl = e.target.image_file.files[0] 
                ? await handleImageUpload({ target: { files: [e.target.image_file.files[0]] } })
                : e.target.image_url.value || null;
              
              handleQuickAdd({
                name: e.target.productName.value,
                price: parseFloat(e.target.price.value),
                quantity: parseInt(e.target.quantity.value) || 0,
                category_id: parseInt(e.target.category.value) || null,
                image_url: imageUrl
              });
              setImagePreview(null);
            }} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nom du produit *</label>
                <input type="text" name="productName" required className="input-field" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Prix *</label>
                  <input type="number" name="price" step="0.01" required className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Quantité</label>
                  <input type="number" name="quantity" defaultValue="0" className="input-field" />
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Catégorie</label>
                <select name="category" className="input-field">
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Image du produit</label>
                <div className="space-y-3">
                  <input 
                    type="file" 
                    name="image_file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }}
                    className="input-field"
                  />
                  <div className="text-xs text-slate-500 text-center">ou</div>
                  <input 
                    type="url" 
                    name="image_url" 
                    placeholder="https://example.com/image.jpg" 
                    className="input-field"
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg border-2 border-slate-200" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => { setShowQuickAddModal(false); setImagePreview(null); }} className="btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" disabled={uploading} className="btn-primary flex-1">
                  {uploading ? 'Téléchargement...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="card w-full max-w-lg">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Modifier le Produit</h2>
                <button 
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const imageUrl = e.target.image_file.files[0] 
                ? await handleImageUpload({ target: { files: [e.target.image_file.files[0]] } })
                : e.target.image_url.value || editingProduct.image_url || null;
              
              handleUpdate({
                name: e.target.productName.value,
                price: parseFloat(e.target.price.value),
                quantity: parseInt(e.target.quantity.value) || 0,
                category_id: parseInt(e.target.category.value) || null,
                image_url: imageUrl
              });
            }} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Nom du produit *</label>
                <input type="text" name="productName" defaultValue={editingProduct.name} required className="input-field" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Prix *</label>
                  <input type="number" name="price" step="0.01" defaultValue={editingProduct.price} required className="input-field" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Quantité</label>
                  <input type="number" name="quantity" defaultValue={editingProduct.quantity || 0} className="input-field" />
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Catégorie</label>
                <select name="category" defaultValue={editingProduct.category_id || ''} className="input-field">
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Image du produit</label>
                <div className="space-y-3">
                  <input 
                    type="file" 
                    name="image_file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }}
                    className="input-field"
                  />
                  <div className="text-xs text-slate-500 text-center">ou</div>
                  <input 
                    type="url" 
                    name="image_url" 
                    defaultValue={editingProduct.image_url || ''}
                    placeholder="https://example.com/image.jpg" 
                    className="input-field"
                  />
                  {(imagePreview || editingProduct.image_url) && (
                    <div className="mt-3">
                      <img 
                        src={imagePreview || editingProduct.image_url} 
                        alt="Preview" 
                        className="h-32 w-32 object-cover rounded-lg border-2 border-slate-200" 
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                  setImagePreview(null);
                }} className="btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" disabled={uploading} className="btn-primary flex-1">
                  {uploading ? 'Téléchargement...' : 'Modifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;

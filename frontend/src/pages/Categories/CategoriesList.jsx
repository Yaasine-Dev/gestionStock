import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { categoriesApi } from "../../api/categories";
import Table from "../../components/Table";
import Swal from 'sweetalert2';
import { 
  FaPlus, FaSearch, FaTags, 
  FaBox, FaWallet
} from 'react-icons/fa';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const canModify = user?.role === "ADMIN" || user?.role === "MANAGER";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, [isAuthenticated, navigate]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter
  useEffect(() => {
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const categoryData = { name: formData.get('name') };

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryData);
        await Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Catégorie modifiée avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await categoriesApi.create(categoryData);
        await Swal.fire({
          icon: 'success',
          title: 'Succès!',
          text: 'Catégorie créée avec succès',
          timer: 2000,
          showConfirmButton: false
        });
      }
      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'enregistrement'
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (category) => {
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
      await categoriesApi.delete(category.id);
      await Swal.fire({
        icon: 'success',
        title: 'Supprimé!',
        text: 'Catégorie supprimée avec succès',
        timer: 2000,
        showConfirmButton: false
      });
      fetchCategories();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de la suppression'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
              <p className="text-gray-600 mt-1">Gérez les catégories de vos produits</p>
            </div>
            {canModify && (
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <FaPlus className="text-sm" />
                <span>Nouvelle Catégorie</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="relative max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <Table
        columns={[
          {
            header: "Nom",
            accessor: "name",
            render: (category) => (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <FaTags className="text-white text-sm" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900">{category.name}</div>
                  <div className="text-xs text-gray-500">ID: {category.id}</div>
                </div>
              </div>
            )
          },
          {
            header: "Nombre de produits",
            accessor: "total_products",
            render: (category) => (
              <div className="flex items-center">
                <FaBox className="text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">{category.total_products || 0}</span>
              </div>
            )
          },
          {
            header: "Quantité totale",
            accessor: "total_quantity",
            render: (category) => (
              <span className="text-sm text-gray-900">{(category.total_quantity || 0).toLocaleString()}</span>
            )
          },
          {
            header: "Valeur du stock",
            accessor: "total_value",
            render: (category) => (
              <div className="flex items-center">
                <FaWallet className="text-green-500 mr-1" />
                <span className="text-sm font-semibold text-gray-900">
                  {(category.total_value || 0).toLocaleString()} DH
                </span>
              </div>
            )
          }
        ]}
        data={filteredCategories}
        onEdit={canModify ? handleEdit : null}
        onDelete={user?.role === "ADMIN" ? (category) => handleDelete(category) : null}
        canEdit={canModify}
        canDelete={user?.role === "ADMIN"}
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom de la catégorie"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCategory ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
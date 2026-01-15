// src/pages/Products/components/ProductCard.jsx
import React from 'react';
import { FaBox, FaTags, FaWallet, FaWarehouse, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ProductCard = ({ product, categories, onView, onEdit, onDelete, isSelected, onSelect }) => {
  const category = categories.find(c => c.id === product.category_id);
  
  return (
    <div className="group relative bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-100 p-5 hover:shadow-soft-xxl transition-all duration-300 hover:-translate-y-1">
      {/* Selection checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="absolute top-4 right-4 rounded border-gray-300 text-primary focus:ring-primary/30"
      />
      
      {/* Product header */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-soft-lg">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full rounded-xl object-cover" />
          ) : (
            <FaBox className="text-white text-xl" />
          )}
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          product.stockStatus === 'inStock' ? 'bg-emerald-100 text-emerald-800' :
          product.stockStatus === 'lowStock' ? 'bg-amber-100 text-amber-800' :
          'bg-red-100 text-red-800'
        }`}>
          {product.totalStock}
        </span>
      </div>
      
      {/* Product info */}
      <h3 className="font-bold text-gray-900 text-lg mb-2 truncate group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {product.description || 'No description available'}
      </p>
      
      {/* Category */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700">
          <FaTags className="mr-1" />
          {category?.name || 'Uncategorized'}
        </span>
      </div>
      
      {/* Price and stock */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-lg font-bold text-gray-900">
          <FaWallet className="mr-1 text-emerald-600" />
          {parseFloat(product.price).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
        </div>
        <div className="text-sm text-gray-500">
          <FaWarehouse className="inline mr-1" />
          Stock: {product.totalStock}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Stock Level</span>
          <span>{Math.min(100, (product.totalStock / 50) * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              product.stockStatus === 'inStock' ? 'bg-emerald-500' :
              product.stockStatus === 'lowStock' ? 'bg-amber-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, (product.totalStock / 50) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button 
            onClick={onView}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button 
            onClick={onEdit}
            className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Edit"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm font-semibold text-gray-700">
          {product.stockValue.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
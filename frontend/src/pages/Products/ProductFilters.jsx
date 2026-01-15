// src/pages/Products/components/ProductFilters.jsx
import React from 'react';
import { FaFilter, FaSearch, FaTimes } from 'react-icons/fa';

const ProductFilters = ({ filters, categories, onFilterChange, onClearFilters }) => {
  return (
    <div className="bg-white rounded-2xl shadow-soft-xl border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaFilter className="mr-2 text-primary" />
          Filters
        </h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
        >
          <FaTimes className="mr-1" />
          Clear all
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => onFilterChange('priceRange', { ...filters.priceRange, min: e.target.value })}
              placeholder="Min"
              className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => onFilterChange('priceRange', { ...filters.priceRange, max: e.target.value })}
              placeholder="Max"
              className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
        
        {/* Stock Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
          <select
            value={filters.stockStatus}
            onChange={(e) => onFilterChange('stockStatus', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
          >
            <option value="all">All Status</option>
            <option value="inStock">In Stock</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
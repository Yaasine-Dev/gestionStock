// src/components/Navbar.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = ({ sidebarOpen }) => {
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Tableau de bord';
    if (path.includes('users')) return 'Utilisateurs';
    if (path.includes('products')) return 'Produits';
    if (path.includes('categories')) return 'Catégories';
    if (path.includes('suppliers')) return 'Fournisseurs';
    if (path.includes('orders')) return 'Commandes';
    if (path.includes('stock')) return 'Stock';
    if (path.includes('profile')) return 'Profil';
    return 'Tableau de bord';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{getPageName()}</h1>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
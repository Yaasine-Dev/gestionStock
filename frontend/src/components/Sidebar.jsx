// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  FaBars, FaTachometerAlt, 
  FaBox, FaUsers, FaTags, FaTruck, 
  FaClipboardList, FaWarehouse, FaUser, FaSignOutAlt
} from 'react-icons/fa';

const MENUS = {
  ADMIN: [
    { 
      title: "Principal",
      items: [
        { label: "Tableau de bord", path: "/dashboard/admin", icon: FaTachometerAlt },
      ]
    },
    { 
      title: "Gestion",
      items: [
        { label: "Utilisateurs", path: "/users", icon: FaUsers },
        { label: "Produits", path: "/products", icon: FaBox },
        { label: "Catégories", path: "/categories", icon: FaTags },
        { label: "Fournisseurs", path: "/suppliers", icon: FaTruck },
      ]
    },
    { 
      title: "Opérations",
      items: [
        { label: "Commandes", path: "/orders", icon: FaClipboardList },
        { label: "Stock", path: "/stock", icon: FaWarehouse },
      ]
    },
  ],
  MANAGER: [
    { 
      title: "Principal",
      items: [
        { label: "Tableau de bord", path: "/dashboard/manager", icon: FaTachometerAlt },
      ]
    },
    { 
      title: "Gestion",
      items: [
        { label: "Produits", path: "/products", icon: FaBox },
        { label: "Commandes", path: "/orders", icon: FaClipboardList },
        { label: "Stock", path: "/stock", icon: FaWarehouse },
      ]
    },
  ],
  EMPLOYEE: [
    { 
      title: "Principal",
      items: [
        { label: "Tableau de bord", path: "/dashboard/employee", icon: FaTachometerAlt },
      ]
    },
    { 
      title: "Gestion",
      items: [
        { label: "Produits", path: "/products", icon: FaBox },
        { label: "Stock", path: "/stock", icon: FaWarehouse },
      ]
    },
  ],
};

export default function Sidebar({ isOpen, onToggle }) {
  const { role, user, logout } = useAuth() || {};
  const location = useLocation();
  const menuSections = MENUS[role] || [];

  return (
    <aside className={`fixed left-0 top-0 z-50 h-screen border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      <div className={`flex h-16 items-center border-b border-slate-200 px-4 ${
        isOpen ? 'justify-between' : 'justify-center'
      }`}>
        {isOpen ? (
          <>
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-9 w-9 rounded-lg shadow-sm object-contain"
              />
              <div>
                <h2 className="text-base font-bold text-slate-900">StockFlow</h2>
                <p className="text-xs text-slate-500">Stock Management sys</p>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaBars className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button 
            onClick={onToggle}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaBars className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 ring-2 ring-white shadow-sm">
              <FaUser className="text-sm text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.role || 'Role'}</p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto p-3">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-6' : ''}>
            {isOpen && (
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{section.title}</p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                      title={!isOpen ? item.label : ''}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-blue-600"></div>
                      )}
                      <Icon className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                      }`} />
                      {isOpen && <span className="flex-1">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="border-t border-slate-200 p-3">
        <div className="space-y-1">
          <Link
            to="/profile"
            className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              location.pathname === '/profile'
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            } ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={!isOpen ? 'Profil' : ''}
          >
            {location.pathname === '/profile' && (
              <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-blue-600"></div>
            )}
            <FaUser className={`h-5 w-5 flex-shrink-0 ${
              location.pathname === '/profile' ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
            }`} />
            {isOpen && <span className="flex-1">Profil</span>}
          </Link>
          <button
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={!isOpen ? 'Déconnexion' : ''}
          >
            <FaSignOutAlt className="h-5 w-5" />
            {isOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

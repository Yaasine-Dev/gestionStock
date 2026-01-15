import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import UsersList from "./pages/Users/UsersList";
import ProductsList from "./pages/Products/ProductsList";
import CategoriesList from "./pages/Categories/CategoriesList";
import SuppliersList from "./pages/Suppliers/SuppliersList";
import OrdersList from "./pages/Orders/OrdersList";
import StockDashboard from "./pages/Stock/StockDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ManagerDashboard from "./pages/Dashboard/ManagerDashboard";
import EmployeeDashboard from "./pages/Dashboard/EmployeeDashboard";
import MainLayout from "./components/Layout/MainLayout";
function Placeholder({ title }) {
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white shadow-soft-xl rounded-2xl bg-clip-border">
      <div className="flex-auto p-6">
        <div className="flex flex-wrap -mx-3">
          <div className="max-w-full px-3 lg:w-1/2 lg:flex-none">
            <div className="flex items-center">
              <div className="p-4 bg-gradient-to-tl from-primary to-info rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h5 className="ml-4 text-lg font-bold text-slate-700">{title}</h5>
            </div>
            <p className="mt-2 mb-4 text-slate-600">
              Cette page est en cours de développement. Le contenu sera bientôt disponible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="profile" element={<Profile />} />
        
        <Route path="dashboard/admin" element={
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="dashboard/manager" element={
          <ProtectedRoute roles={["MANAGER"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="dashboard/employee" element={
          <ProtectedRoute roles={["EMPLOYEE"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="users" element={
          <ProtectedRoute roles={["ADMIN"]}>
            <UsersList />
          </ProtectedRoute>
        } />
        
        <Route path="products" element={
          <ProtectedRoute roles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
            <ProductsList />
          </ProtectedRoute>
        } />
        
        <Route path="categories" element={
          <ProtectedRoute roles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
            <CategoriesList />
          </ProtectedRoute>
        } />
        
        <Route path="suppliers" element={
          <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
            <SuppliersList />
          </ProtectedRoute>
        } />
        
        <Route path="orders" element={
          <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
            <OrdersList />
          </ProtectedRoute>
        } />
        
        <Route path="stock" element={
          <ProtectedRoute roles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
            <StockDashboard />
          </ProtectedRoute>
        } />
        
        <Route index element={<Navigate to="dashboard/admin" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
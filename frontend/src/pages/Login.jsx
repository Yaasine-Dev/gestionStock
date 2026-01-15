import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaEye, FaEyeSlash, FaEnvelope, FaLock,
  FaShieldAlt, FaUserTie, FaUsers, FaCrown,
  FaArrowRight, FaBoxOpen, FaChartLine, FaWarehouse,
  FaCheck, FaPallet
} from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [animateBoxes, setAnimateBoxes] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimateBoxes(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await auth.login(formData.email, formData.password);
      await new Promise(r => setTimeout(r, 700));
      const roleRoutes = {
        ADMIN: "/dashboard/admin",
        MANAGER: "/dashboard/manager",
        EMPLOYEE: "/dashboard/employee",
      };
      navigate(from || roleRoutes[user.role] || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Identifiants invalides");
      setLoading(false);
    }
  }

  const roles = [
    { role: "ADMIN", icon: FaCrown, label: "Admin", color: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-purple-100" },
    { role: "MANAGER", icon: FaUserTie, label: "Manager", color: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-blue-100" },
    { role: "EMPLOYEE", icon: FaUsers, label: "Employé", color: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-emerald-100" }
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 overflow-hidden">
      
      {/* Left Side - Premium Visual Section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900/90 to-purple-900/90">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl animate-float-slow" />
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/15 to-blue-500/15 blur-xl animate-float-medium" />
        
        {/* Animated Stock Visualization */}
        <div className="absolute bottom-0 right-0 w-2/5 h-2/3">
          {/* Shelving Units */}
          <div className="absolute right-32 bottom-32 w-48 h-48">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30"
                style={{ top: `${i * 25}%` }}
              />
            ))}
            
            {/* Animated Boxes */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className={`absolute w-8 h-8 rounded bg-gradient-to-br from-blue-400/40 to-indigo-400/40 backdrop-blur-sm border border-white/20 transform transition-all duration-700 ${
                  animateBoxes ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
                style={{
                  left: `${20 + (i % 3) * 30}%`,
                  top: `${15 + Math.floor(i / 3) * 30}%`,
                  transitionDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
          
          {/* Conveyor Belt Line */}
          <div className="absolute right-20 bottom-40 w-64 h-1 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent">
            <div className="absolute w-4 h-4 rounded-full bg-blue-400/30 -top-1.5 animate-conveyor" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 p-14 flex flex-col justify-center max-w-2xl">
          <div className="space-y-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-16 h-16 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform object-contain"
              />
              <h1 className="text-4xl font-bold text-white">StockFlow</h1>
            </div>

            <div>
              <h2 className="text-5xl font-bold leading-tight mb-4 text-white">
                Gestion Intelligente
                <span className="block text-blue-200 mt-2">des Stocks</span>
              </h2>
              <p className="text-lg text-blue-100/80 leading-relaxed">
                Optimisez vos opérations d'entrepôt avec un suivi en temps réel,
                des analyses prédictives et une gestion automatisée des flux.
                Sécurité de niveau entreprise et design intuitif.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {[
                { icon: FaChartLine, text: "Tableau de bord analytique en temps réel" },
                { icon: FaBoxOpen, text: "Suivi intelligent des stocks" },
                { icon: FaShieldAlt, text: "Sécurité de niveau bancaire" },
                { icon: FaPallet, text: "Réapprovisionnement automatique" }
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 text-blue-100/90 animate-slide-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center transform hover:scale-110 transition-transform">
                    <feature.icon className="text-blue-300" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-white/10 animate-fade-in">
              {[
                { value: "99.9%", label: "Disponibilité" },
                { value: "2K+", label: "Entrepôts" },
                { value: "24/7", label: "Support" }
              ].map((stat, idx) => (
                <div key={idx} className="transform hover:scale-105 transition-transform">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-blue-200/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-14 h-14 rounded-2xl shadow-lg transform hover:scale-105 transition-transform object-contain"
              />
              <h1 className="text-2xl font-bold text-slate-900">StockFlow Pro</h1>
            </div>
          </div>

          {/* Glassmorphism Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
            
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/40">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Bon Retour
                </h2>
                <p className="text-slate-600 mt-2">Connectez-vous à votre tableau de bord</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Adresse Email
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange("email", e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/70 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 outline-none shadow-sm hover:shadow-md"
                      placeholder="nom@entreprise.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">
                      Mot de Passe
                    </label>
                    <a 
                      href="#" 
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={e => handleInputChange("password", e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/70 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 outline-none shadow-sm hover:shadow-md"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors transform hover:scale-110"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={formData.rememberMe}
                      onChange={e => handleInputChange("rememberMe", e.target.checked)}
                      className="sr-only"
                    />
                    <label 
                      htmlFor="remember"
                      className="flex items-center cursor-pointer"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        formData.rememberMe 
                          ? 'bg-indigo-500 border-indigo-500' 
                          : 'bg-white border-slate-300'
                      }`}>
                        {formData.rememberMe && (
                          <FaCheck className="text-white text-xs animate-scale-in" />
                        )}
                      </div>
                      <span className="ml-3 text-sm text-slate-700">
                        Se souvenir de moi pendant 30 jours
                      </span>
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm animate-shake">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                      {error}
                    </div>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group/btn"
                >
                  <span>{loading ? "Connexion..." : "Se connecter"}</span>
                  <FaArrowRight className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10" />
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/90 text-slate-500">Niveaux d'accès</span>
                </div>
              </div>

              {/* Role Badges */}
              <div className="grid grid-cols-3 gap-4">
                {roles.map((r, idx) => {
                  const Icon = r.icon;
                  return (
                    <div 
                      key={r.role}
                      className="text-center group cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className={`mx-auto w-14 h-14 ${r.bg} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 relative overflow-hidden`}>
                        <Icon className={`${r.color} text-lg relative z-10`} />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-700">{r.label}</p>
                      <div className="h-0.5 w-6 bg-gradient-to-r from-transparent via-slate-300 to-transparent mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <p className="text-center text-slate-500 text-sm mt-8">
                Besoin d'aide ?{" "}
                <a 
                  href="#" 
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Contacter le support
                </a>
              </p>
            </div>
          </div>


        </div>
      </div>

      {/* Add custom animations to Tailwind */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        
        @keyframes conveyor {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(300px); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-conveyor {
          animation: conveyor 3s linear infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
          animation-delay: 0.2s;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
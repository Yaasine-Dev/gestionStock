import React from 'react';

export default function PageLayout({ children, title, subtitle, className = "" }) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 ${className}`}>
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      
      {/* Floating Elements */}
      <div className="fixed top-1/4 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/8 to-blue-500/8 blur-xl animate-float-medium pointer-events-none" />
      
      <div className="relative z-10">
        {title && (
          <div className="bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="animate-slide-up">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-slate-600 mt-2">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="animate-fade-in">
          {children}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
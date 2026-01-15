import React from 'react';

export default function GlassCard({ children, className = "", hover = true }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
      <div className={`relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 ${hover ? 'transform hover:scale-[1.02] transition-all duration-300' : ''}`}>
        {children}
      </div>
    </div>
  );
}
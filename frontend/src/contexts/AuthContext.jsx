import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.user) {
          setUser(parsed.user);
          setToken(parsed.token || null);
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  async function login(email, password) {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Email ou mot de passe invalide");
      }

      const data = await res.json();
      // Expecting { user: {id, name, email, role}, token?: '...' }
      const u = data.user || data;
      const t = data.token || data.access_token || null;
      setUser(u);
      setToken(t);
      setIsAuthenticated(true);
      localStorage.setItem("auth", JSON.stringify({ user: u, token: t }));
      return u;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error(
          "La connexion a pris trop de temps. Vérifiez que le serveur est démarré."
        );
      }
      if (error.message) {
        throw error;
      }
      throw new Error(
        "Erreur de connexion. Vérifiez que le serveur est démarré."
      );
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
    navigate("/login");
  }

  return (
    <AuthContext.Provider
      value={{ user, role: user?.role, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

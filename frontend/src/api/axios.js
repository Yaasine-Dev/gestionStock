import axios from "axios";
import { showToast } from "../components/toast";

const api = axios.create({
  baseURL: "http://localhost:8000", // FastAPI
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: (status) => {
    // Don't throw on 405 for analytics endpoints
    return status < 500 || status === 405;
  },
});

// Intercepteur → ajoute automatiquement le token et x_user_id
api.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem("auth") || '{}');
    const token = authData.token;
    const userId = authData.user?.id;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (userId) {
      config.headers["X-User-ID"] = userId.toString();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: show toast on 401 and clear auth
api.interceptors.response.use(
  (response) => {
    // Reject 405 responses for analytics endpoints to trigger catch block
    if (response.status === 405 && 
        (response.config?.url?.includes('/stock/trend') || 
         response.config?.url?.includes('/stock/evolution-value'))) {
      return Promise.reject({ response, silent: true });
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      showToast("Session expirée ou non autorisé. Veuillez vous reconnecter.", { type: "error" });
      try {
        localStorage.removeItem("auth");
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default api;

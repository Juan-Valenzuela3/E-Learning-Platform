// src/lib/api.js
import axios from "axios";

// 🌐 Base URL según el entorno
const API_URL = import.meta.env.DEV 
  ? import.meta.env.VITE_API_URL || "" // En desarrollo usar la URL del backend desplegado o proxy de Vite
  : ""; // En producción, usar rutas relativas que Vercel proxy manejará

// ✅ Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔑 Helpers para tokens
const STORAGE_KEY={
  TOKEN : 'token',
  USER : 'user',
}

export const getToken = () => localStorage.getItem(STORAGE_KEY.TOKEN);
export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEY.TOKEN, token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY.TOKEN);
  localStorage.removeItem(STORAGE_KEY.USER);
  delete api.defaults.headers.common["Authorization"];
};

// 🔗 Interceptor para adjuntar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⏳ Reintento automático si hubo timeout
    if (error.code === "ECONNABORTED" && !originalRequest._retry) {
      originalRequest._retry = true;
      return api(originalRequest);
    }

    // 🌐 Error de red
    if (error.code === "ERR_NETWORK") {
      return Promise.reject(
        new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
      );
    }

    // ❌ Sin respuesta del servidor
    if (!error.response) {
      return Promise.reject(
        new Error("El servidor no respondió. Intenta más tarde.")
      );
    }

    const { status, data } = error.response;

    // 🔑 Sesión expirada
    if (status === 401) {
      clearAuth();
      if (window.location.pathname !== "/auth") {
        window.location.href = "/auth";
      }
      return Promise.reject(
        new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
      );
    }

    // ⚠️ Error 400 - Bad Request (errores de validación)
    if (status === 400) {
      console.log('=== API INTERCEPTOR: Error 400 ===');
      console.log('Data:', data);
      console.log('Original Error:', error);
      
      // Preservar el error original para que el service pueda manejarlo
      return Promise.reject(error);
    }

    // 🚫 Error 403 - Forbidden (problemas de permisos/CORS)
    if (status === 403) {
      console.error('=== API INTERCEPTOR: Error 403 ===');
      console.error('URL:', originalRequest.url);
      console.error('Method:', originalRequest.method);
      console.error('Headers:', originalRequest.headers);
      console.error('Data:', data);
      
      let errorMessage = "No tienes permiso para esta acción";
      
      // Verificar si es un error de CORS específicamente
      if (typeof data === 'string' && data.includes('CORS')) {
        errorMessage = "Error de configuración CORS. Verifica que el backend esté configurado correctamente.";
      } else if (typeof data === 'string' && data.includes('Invalid CORS request')) {
        errorMessage = "Petición CORS inválida. Verifica la configuración del servidor.";
      }
      
      return Promise.reject(new Error(errorMessage));
    }

    // ⚠️ Otros errores comunes
    let errorMessage = data?.message || "Ocurrió un error inesperado";
    if (status === 404) errorMessage = "Recurso no encontrado";
    if (status === 500)
      errorMessage = "Error interno del servidor. Intenta más tarde.";

    return Promise.reject(new Error(errorMessage));
  }
);



export default api;
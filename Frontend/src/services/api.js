// src/lib/api.js
import axios from "axios";

const isProd = import.meta.env.MODE === 'production' || import.meta.env.VITE_ENV === 'production';

// 🌐 Base URL según el entorno
const API_URL = isProd
  ? ''
  : import.meta.env.VITE_API_URL;


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
const STORAGE_KEY = {
  TOKEN: 'token',
  USER: 'user',
}

// 🛠️ Utilidades para validar formato de datos
const validateApiResponse = (data) => {
  if (!data) return null;

  // Si es string, intentar parsear como JSON
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.warn('⚠️ No se pudo parsear respuesta como JSON:', parseError.message);
      return { message: data };
    }
  }

  // Si ya es objeto, devolverlo tal como está
  if (typeof data === 'object') {
    return data;
  }

  return data;
};

const cleanApiData = (data) => {
  // Si ya es un objeto válido, no procesarlo
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => {
      // Solo procesar si el item es string
      if (typeof item === 'string') {
        return validateApiResponse(item);
      }
      return item;
    });
  }

  return validateApiResponse(data);
};

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

// 🚨 Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // ✅ Solo procesar si la respuesta es string (no ya parseada)
    if (response.data && typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data);
      } catch (error) {
        console.warn('⚠️ Error parsing JSON response:', error.message);
        // Mantener la respuesta original si no se puede parsear
      }
    }

    return response;
  },
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

    // 🔍 Usar datos de error directamente sin procesar
    const errorData = data;

    // 🔑 Sesión expirada
    if (status === 401) {
      clearAuth();
      if (window.location.pathname !== "/authentication") {
        window.location.href = "/authentication/login";
      }
      return Promise.reject(
        new Error("Tu sesión ha expirado. Inicia sesión nuevamente.")
      );
    }

    // ⚠️ Error 400 - Bad Request (errores de validación)
    if (status === 400) {
      console.log('=== API INTERCEPTOR: Error 400 ===');
      console.log('Data:', errorData);
      console.log('Original Error:', error);

      // Preservar el error original para que el service pueda manejarlo
      return Promise.reject(error);
    }

    // ⚠️ Otros errores comunes
    let errorMessage = errorData?.message || "Ocurrió un error inesperado";
    if (status === 403) errorMessage = "No tienes permiso para esta acción";
    if (status === 404) errorMessage = "Recurso no encontrado";
    if (status === 500)
      errorMessage = "Error interno del servidor. Intenta más tarde.";

    return Promise.reject(new Error(errorMessage));
  }
);



// 📤 Exportar utilidades y API
export { validateApiResponse, cleanApiData };
export default api;

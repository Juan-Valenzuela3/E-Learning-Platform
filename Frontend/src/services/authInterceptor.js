// src/services/authInterceptor.js
import api from "./api";

export const setupAuthInterceptor = (store) => {
  api.interceptors.request.use((config) => {
    const token = store?.getState?.().auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};


export const setupResponseInterceptors = (store) => {
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // limpiar auth o redirigir al login
          store?.dispatch?.({ type: 'LOGOUT' });
        }
        return Promise.reject(error);
      }
    );
  };
  

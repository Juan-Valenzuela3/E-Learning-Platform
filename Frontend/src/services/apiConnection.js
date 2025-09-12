import axios from 'axios';
 //importamos la url de la api en la variable de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
//creamo interceptor para agregar el token al header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
//creamo interceptor para manejar la respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la respuesta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export default api;
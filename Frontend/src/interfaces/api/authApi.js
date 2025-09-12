// src/interfaces/api/authApi.js
import api from '@/services/apiConnection';
import mockAuthService from './__mocks__/mockAuthService';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const authService = {
  login: async (email, password) => {
    if (useMocks) return mockAuthService.login(email, password);
    
    const response = await api.post('/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (userData) => {
    if (useMocks) return mockAuthService.register(userData);
    
    const response = await api.post('/register', userData);
    return response.data;
  },

  getProfile: async () => {
    if (useMocks) return mockAuthService.getProfile();
    
    const response = await api.get('/me');
    return response.data;
  },

  // ...otros métodos
};

export default authService;
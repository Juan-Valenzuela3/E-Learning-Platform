import api from './api';

export default {
  // Autenticación
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      }
      
      throw new Error('No se recibió un token de autenticación');
    } catch (error) {
      console.error('Error en login:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Registro de usuario
  async register(userData) {
    try {
      const payload = {
        userName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: userData.accountType === 'teacher' ? 'INSTRUCTOR' : 'STUDENT'
      };

      const response = await api.post('/api/users/register', payload);
      
      if (response.data) {
        console.log('Registro exitoso:', response.data);
        return { success: true, data: response.data };
      }

      throw new Error('No se recibieron datos del servidor');
    } catch (error) {
      console.error('Error en registro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  // Obtener usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Verificar autenticación
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

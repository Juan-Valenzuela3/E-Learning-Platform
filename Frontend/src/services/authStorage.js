// src/services/authStorage.js

/**
 * Manejo de autenticación en localStorage
 */

/**
 * Obtiene los datos del usuario almacenados
 * @returns {Object|null} Datos del usuario o null si no existen
 */
export const getUser = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return null;
  }
};

/**
 * Guarda los datos del usuario
 * @param {Object} user - Datos del usuario
 */
export const setUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Error al guardar datos del usuario:', error);
  }
};

/**
 * Elimina los datos del usuario
 */
export const removeUser = () => {
  try {
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error al eliminar datos del usuario:', error);
  }
};

/**
 * Obtiene el token almacenado
 * @returns {string|null} Token o null si no existe
 */
export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};

/**
 * Guarda el token
 * @param {string} token - Token de autenticación
 */
export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error al guardar el token:', error);
  }
};

/**
 * Elimina el token
 */
export const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error al eliminar el token:', error);
  }
};

/**
 * Limpia todos los datos de autenticación (token + usuario)
 */
export const clearAuth = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error al limpiar datos de autenticación:', error);
  }
};

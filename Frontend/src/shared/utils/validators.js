// src/utils/validators.js
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  // Asegurarse de que la contraseña tiene al menos 8 caracteres
  return password.length >= 8;
};
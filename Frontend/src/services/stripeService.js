// src/services/stripeService.js
import api from './api';

/**
 * Servicio para manejar pagos con Stripe
 */

/**
 * Crea una sesión de pago en Stripe para un curso
 * @param {number} courseId - ID del curso
 * @param {number} userId - ID del usuario
 * @param {string} successUrl - URL de redirección después del pago exitoso
 * @param {string} cancelUrl - URL de redirección si se cancela el pago
 * @returns {Promise<Object>} Respuesta con sessionId y checkoutUrl
 */
export const createCheckoutSession = async (courseId, userId, successUrl, cancelUrl) => {
  try {
    const response = await api.post('/api/stripe/create-checkout-session', {
      courseId,
      userId,
      successUrl,
      cancelUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error(
      error.response?.data?.message ||
      'Error al crear la sesión de pago. Por favor, inténtalo de nuevo.'
    );
  }
};

/**
 * Obtiene el historial de pagos de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de pagos del usuario
 */
export const getUserPayments = async (userId) => {
  try {
    const response = await api.get(`/api/payments/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user payments:', error);
    throw new Error(
      error.response?.data?.message ||
      'Error al obtener el historial de pagos. Por favor, inténtalo de nuevo.'
    );
  }
};

/**
 * Obtiene los pagos de un curso específico
 * @param {number} courseId - ID del curso
 * @returns {Promise<Array>} Lista de pagos del curso
 */
export const getCoursePayments = async (courseId) => {
  try {
    const response = await api.get(`/api/payments/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course payments:', error);
    throw new Error(
      error.response?.data?.message ||
      'Error al obtener los pagos del curso. Por favor, inténtalo de nuevo.'
    );
  }
};

/**
 * Obtiene un pago específico por ID
 * @param {number} paymentId - ID del pago
 * @returns {Promise<Object>} Información del pago
 */
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/api/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw new Error(
      error.response?.data?.message ||
      'Error al obtener la información del pago. Por favor, inténtalo de nuevo.'
    );
  }
};

/**
 * Obtiene las sesiones de pago de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Array>} Lista de sesiones de pago del usuario
 */
export const getUserPaymentSessions = async (userId) => {
  try {
    const response = await api.get(`/api/payment-sessions/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user payment sessions:', error);
    throw new Error(
      error.response?.data?.message ||
      'Error al obtener las sesiones de pago. Por favor, inténtalo de nuevo.'
    );
  }
};

/**
 * Obtiene una sesión de pago específica por ID
 * @param {number} sessionId - ID de la sesión de pago
 * @returns {Promise<Object>} Información de la sesión de pago
 */
export const getPaymentSessionById = async (sessionId) => {
  try {
    const response = await api.get(`/api/payment-sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment session:', error);
    throw new Error(
      error.response?.data?.message ||
      'Error al obtener la información de la sesión de pago. Por favor, inténtalo de nuevo.'
    );
  }
};

/**
 * Verifica el estado de salud del servicio de Stripe
 * @returns {Promise<string>} Estado del servicio
 */
export const checkStripeHealth = async () => {
  try {
    const response = await api.get('/api/stripe/health');
    return response.data;
  } catch (error) {
    console.error('Error checking Stripe health:', error);
    throw new Error('El servicio de pagos no está disponible');
  }
};

/**
 * Redirige al usuario a Stripe Checkout
 * @param {string} checkoutUrl - URL de Stripe Checkout
 */
export const redirectToStripeCheckout = (checkoutUrl) => {
  if (checkoutUrl) {
    window.location.href = checkoutUrl;
  } else {
    throw new Error('URL de pago no disponible');
  }
};

/**
 * Procesa el pago de un curso
 * @param {Object} course - Información del curso
 * @param {Object} user - Información del usuario
 * @returns {Promise<void>}
 */
export const processCoursePayment = async (course, user) => {
  try {
    // URLs de redirección
    const baseUrl = window.location.origin;
    const successUrl = `${baseUrl}/payment/success?courseId=${course.id}`;
    const cancelUrl = `${baseUrl}/payment/cancel?courseId=${course.id}`;

    // Crear sesión de pago
    const sessionData = await createCheckoutSession(
      course.id,
      user.id,
      successUrl,
      cancelUrl
    );

    // Redirigir a Stripe Checkout
    redirectToStripeCheckout(sessionData.checkoutUrl);
  } catch (error) {
    console.error('Error processing course payment:', error);
    throw error;
  }
};

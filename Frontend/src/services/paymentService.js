import api from './api'

export async function createStripeCheckoutSession(courseId, userId, successUrl, cancelUrl) {
  try {
    const response = await api.post('/stripe/create-checkout-session', {
      courseId,
      userId,
      successUrl,
      cancelUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la sesión de pago', error);
    throw error;
  }
}
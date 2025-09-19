// Frontend/src/services/paymentService.js
import api from './api';
import { toast } from 'sonner';

/**
 * Servicio completo de pagos con manejo avanzado de errores
 * y funcionalidades extendidas
 */
export class PaymentService {
  // === MÉTODOS PRINCIPALES DE STRIPE ===

  /**
   * Crea una sesión de checkout de Stripe con validaciones completas
   */
  static async createCheckoutSession(courseId, userId, options = {}) {
    try {
      // Validaciones de entrada
      if (!courseId || !userId) {
        throw new Error('Los parámetros courseId y userId son requeridos');
      }

      const baseUrl = window.location.origin;
      const request = {
        courseId: Number(courseId),
        userId: Number(userId),
        successUrl: options.successUrl || `${baseUrl}/payment/success?courseId=${courseId}`,
        cancelUrl: options.cancelUrl || `${baseUrl}/payment/cancel?courseId=${courseId}`,
        ...options.metadata && { metadata: options.metadata }
      };

      console.log('🔄 Creando sesión de pago:', request);

      const response = await api.post('/api/stripe/create-checkout-session', request);

      console.log('✅ Sesión de pago creada:', response.data);

      return {
        success: true,
        data: response.data,
        sessionId: response.data.sessionId,
        checkoutUrl: response.data.checkoutUrl,
        paymentSessionId: response.data.paymentSessionId
      };

    } catch (error) {
      console.error('❌ Error al crear sesión de pago:', error);

      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          'Error inesperado al procesar el pago';

      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  }

  /**
   * Procesa el pago completo de un curso con UX mejorada
   */
  static async processCoursePayment(course, user, options = {}) {
    try {
      // Verificar disponibilidad del servicio
      const healthCheck = await this.checkStripeHealth();
      if (!healthCheck.success) {
        throw new Error('El servicio de pagos no está disponible temporalmente');
      }

      // Crear sesión con configuración extendida
      const sessionResult = await this.createCheckoutSession(course.id, user.id, {
        ...options,
        metadata: {
          courseTitle: course.title,
          userEmail: user.email,
          timestamp: new Date().toISOString(),
          ...options.metadata
        }
      });

      if (!sessionResult.success) {
        throw new Error(sessionResult.error);
      }

      // Guardar información de sesión localmente para recuperación
      this.saveSessionInfo(sessionResult.data);

      // Redirigir a Stripe
      return this.redirectToCheckout(sessionResult.data.checkoutUrl);

    } catch (error) {
      console.error('❌ Error procesando pago del curso:', error);
      toast.error(`Error al procesar el pago: ${error.message}`);
      throw error;
    }
  }

  // === MÉTODOS DE HISTORIAL Y CONSULTAS ===

  /**
   * Obtiene el historial de pagos con filtros avanzados
   */
  static async getPaymentHistory(userId, filters = {}) {
    try {
      const params = new URLSearchParams();

      // Aplicar filtros
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters.dateFrom) {
        params.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.append('dateTo', filters.dateTo);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }

      const url = `/api/payments/user/${userId}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);

      return {
        success: true,
        data: response.data,
        payments: Array.isArray(response.data) ? response.data : response.data.payments || [],
        summary: response.data.summary,
        pagination: response.data.pagination
      };

    } catch (error) {
      console.error('❌ Error obteniendo historial de pagos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener el historial de pagos',
        data: null
      };
    }
  }

  /**
   * Obtiene estadísticas de pagos del usuario
   */
  static async getPaymentStatistics(userId) {
    try {
      const historyResult = await this.getPaymentHistory(userId);

      if (!historyResult.success) {
        throw new Error(historyResult.error);
      }

      const payments = historyResult.payments;

      const stats = {
        totalSpent: payments
          .filter(p => p.status === 'COMPLETED')
          .reduce((sum, p) => sum + (p.amount || 0), 0),
        totalTransactions: payments.length,
        completedTransactions: payments.filter(p => p.status === 'COMPLETED').length,
        pendingTransactions: payments.filter(p => p.status === 'PENDING').length,
        refundedTransactions: payments.filter(p => p.status === 'REFUNDED').length,
        failedTransactions: payments.filter(p => p.status === 'FAILED').length,
        coursesOwned: [...new Set(payments
          .filter(p => p.status === 'COMPLETED')
          .map(p => p.course?.id)
          .filter(Boolean)
        )].length,
        averagePayment: payments.length > 0
          ? payments.reduce((sum, p) => sum + (p.amount || 0), 0) / payments.length
          : 0,
        lastPaymentDate: payments.length > 0
          ? new Date(Math.max(...payments.map(p => new Date(p.createdAt))))
          : null
      };

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas de pagos:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener estadísticas de pagos'
      };
    }
  }

  // === MÉTODOS DE UTILIDAD ===

  /**
   * Verifica el estado de salud del servicio Stripe
   */
  static async checkStripeHealth() {
    try {
      const response = await api.get('/api/stripe/health');
      return {
        success: true,
        data: response.data,
        status: 'healthy'
      };
    } catch (error) {
      console.error('❌ Servicio de Stripe no disponible:', error);
      return {
        success: false,
        error: 'Servicio de pagos no disponible',
        status: 'unhealthy'
      };
    }
  }

  /**
   * Redirige a Stripe Checkout con manejo de errores
   */
  static redirectToCheckout(checkoutUrl) {
    try {
      if (!checkoutUrl) {
        throw new Error('URL de checkout no válida');
      }

      console.log('🔄 Redirigiendo a Stripe Checkout:', checkoutUrl);
      window.location.href = checkoutUrl;

      return {
        success: true,
        message: 'Redirigiendo a Stripe...'
      };

    } catch (error) {
      console.error('❌ Error en redirección:', error);
      toast.error('Error al acceder al sistema de pagos');

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Guarda información de sesión para recuperación
   */
  static saveSessionInfo(sessionData) {
    try {
      const sessionInfo = {
        sessionId: sessionData.sessionId,
        paymentSessionId: sessionData.paymentSessionId,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      sessionStorage.setItem('paymentSession', JSON.stringify(sessionInfo));
    } catch (error) {
      console.warn('⚠️ No se pudo guardar información de sesión:', error);
    }
  }

  /**
   * Recupera información de sesión guardada
   */
  static getStoredSessionInfo() {
    try {
      const stored = sessionStorage.getItem('paymentSession');
      if (!stored) return null;

      const sessionInfo = JSON.parse(stored);

      // Verificar si no ha expirado
      if (new Date() > new Date(sessionInfo.expiresAt)) {
        sessionStorage.removeItem('paymentSession');
        return null;
      }

      return sessionInfo;
    } catch (error) {
      console.warn('⚠️ Error recuperando información de sesión:', error);
      return null;
    }
  }

  /**
   * Limpia información de sesión almacenada
   */
  static clearSessionInfo() {
    try {
      sessionStorage.removeItem('paymentSession');
    } catch (error) {
      console.warn('⚠️ Error limpiando información de sesión:', error);
    }
  }

  // === MÉTODOS DE DESCARGA DE DOCUMENTOS ===

  /**
   * Descarga factura de pago
   */
  static async downloadInvoice(paymentId) {
    try {
      const response = await api.get(`/api/payments/${paymentId}/invoice`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success('Factura descargada exitosamente');

      return {
        success: true,
        message: 'Factura descargada'
      };

    } catch (error) {
      console.error('❌ Error descargando factura:', error);
      toast.error('Error al descargar la factura');

      return {
        success: false,
        error: error.message || 'Error al descargar factura'
      };
    }
  }

  /**
   * Exporta historial de pagos
   */
  static async exportPaymentHistory(userId, format = 'csv') {
    try {
      const response = await api.get(`/api/payments/user/${userId}/export`, {
        params: { format },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `historial-pagos.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success('Historial exportado exitosamente');

      return {
        success: true,
        message: 'Historial exportado'
      };

    } catch (error) {
      console.error('❌ Error exportando historial:', error);
      toast.error('Error al exportar el historial');

      return {
        success: false,
        error: error.message || 'Error al exportar historial'
      };
    }
  }
}

// === EXPORTS COMPATIBLES CON LA VERSIÓN ANTERIOR ===

export const createStripeCheckoutSession = PaymentService.createCheckoutSession;
export const getUserPayments = PaymentService.getPaymentHistory;
export const processCoursePayment = PaymentService.processCoursePayment;
export const checkStripeHealth = PaymentService.checkStripeHealth;

// Export por defecto
export default PaymentService;
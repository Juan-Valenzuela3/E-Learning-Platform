// Frontend/src/features/payment/components/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import {
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Info,
  Star,
  Users,
  BookOpen
} from "lucide-react";
import { toast } from 'sonner';
import PaymentService from '@/services/paymentService';
import { useAuth } from '@/contexts/useAuth';

const PaymentModal = ({
  isOpen,
  onClose,
  course,
  onPaymentSuccess,
  onPaymentError
}) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [serviceHealth, setServiceHealth] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Verificar salud del servicio al abrir el modal
  useEffect(() => {
    if (isOpen) {
      checkServiceAvailability();
    }
  }, [isOpen]);

  const checkServiceAvailability = async () => {
    try {
      const healthResult = await PaymentService.checkStripeHealth();
      setServiceHealth(healthResult);
    } catch (error) {
      console.error('❌ Error al verificar la disponibilidad del servicio:', error);
      setServiceHealth({ success: false, error: 'Servicio no disponible' });
    }
  };

  const handlePayment = async () => {
    if (!course || !user) {
      toast.error('Información del curso o usuario no disponible');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Verificar servicio antes del pago
      const healthCheck = await PaymentService.checkStripeHealth();
      if (!healthCheck.success) {
        throw new Error('El servicio de pagos no está disponible temporalmente');
      }

      // Procesar pago
      const result = await PaymentService.processCoursePayment(course, user, {
        metadata: {
          source: 'payment_modal',
          courseTitle: course.title,
          userEmail: user.email
        }
      });

      if (result.success) {
        toast.success('Redirigiendo al sistema de pagos...');
        onPaymentSuccess?.(result);
      }

    } catch (error) {
      console.error('❌ Error en el pago:', error);
      const errorMessage = error.message || 'Error inesperado al procesar el pago';
      setPaymentError(errorMessage);
      onPaymentError?.(error);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CreditCard className="w-6 h-6 text-red-500" />
            Confirmar Compra
          </DialogTitle>
          <DialogDescription>
            Estás a punto de comprar acceso al curso. Serás redirigido a nuestro procesador de pagos seguro.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información del curso */}
          <Card className="border-2 border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg leading-tight mb-2">
                    {course.title}
                  </h3>

                  {course.shortDescription && (
                    <p className="text-sm text-gray-600 mb-3">
                      {course.shortDescription}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {course.estimatedHours && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {course.estimatedHours}h
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-red-600">
                      {formatPrice(course.price)}
                    </div>
                    {course.instructor && (
                      <div className="text-sm text-gray-500">
                        Por {course.instructor.userName} {course.instructor.lastName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información adicional del curso */}
          {showDetails && (
            <Card className="border border-blue-100 bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  Qué obtienes con este curso
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Acceso de por vida al contenido
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Contenido actualizado regularmente
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Certificado de finalización
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Soporte del instructor
                  </li>
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Toggle para mostrar detalles */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-blue-600 hover:text-blue-700"
          >
            {showDetails ? 'Ocultar detalles' : 'Ver qué incluye este curso'}
          </Button>

          {/* Estado del servicio */}
          {serviceHealth && !serviceHealth.success && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                El servicio de pagos está experimentando problemas. Por favor, inténtalo más tarde.
              </span>
            </div>
          )}

          {/* Error de pago */}
          {paymentError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-800">{paymentError}</span>
            </div>
          )}

          {/* Información de seguridad */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Pago seguro procesado por Stripe</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing || (serviceHealth && !serviceHealth.success)}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar {formatPrice(course.price)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
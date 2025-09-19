// Frontend/src/features/payment/pages/PaymentCancel.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  BookOpen,
  CreditCard,
  AlertTriangle,
  HelpCircle,
  Home,
  Shield,
  Mail,
  Phone,
  Clock,
  Wifi,
  Activity
} from "lucide-react";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import Alert from '@mui/material/Alert';

import { toast } from 'sonner';
import { motion } from "framer-motion";
import { getCourseById } from '@/services/courseService';
import PaymentService from '@/services/paymentService';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Estados
  const [courseId, setCourseId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [serviceHealth, setServiceHealth] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('user_cancelled');

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const courseIdParam = searchParams.get("courseId");
        const sessionIdParam = searchParams.get("session_id");
        const errorParam = searchParams.get("error");

        if (courseIdParam) setCourseId(courseIdParam);
        if (sessionIdParam) setSessionId(sessionIdParam);

        // Determinar razón de cancelación
        if (errorParam) {
          setCancellationReason(errorParam);
        }

        // Cargar datos del curso
        if (courseIdParam) {
          try {
            const courseData = await getCourseById(courseIdParam);
            setCourse(courseData);
          } catch (error) {
            console.warn('No se pudo cargar el curso:', error);
          }
        }

        // Verificar estado del servicio
        const healthCheck = await PaymentService.checkStripeHealth();
        setServiceHealth(healthCheck);

        // Limpiar información de sesión
        PaymentService.clearSessionInfo();

      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // Mostrar toast informativo
  useEffect(() => {
    if (!isLoading) {
      const reason = getCancellationMessage(cancellationReason);
      toast.info(reason.title);
    }
  }, [isLoading, cancellationReason]);

  // Funciones de navegación
  const handleRetryPayment = async () => {
    if (!courseId) {
      navigate("/cursos");
      return;
    }

    setRetryAttempt(prev => prev + 1);

    // Verificar salud del servicio antes de reintentar
    const healthCheck = await PaymentService.checkStripeHealth();
    if (!healthCheck.success) {
      toast.error('El servicio de pagos no está disponible. Inténtalo más tarde.');
      return;
    }

    navigate(`/curso/${courseId}`);
  };

  const handleGoToCourses = () => {
    navigate("/cursos");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleContactSupport = () => {
    navigate("/contacto", {
      state: {
        issue: 'payment_problem',
        courseId: courseId,
        sessionId: sessionId
      }
    });
  };

  // Obtener mensaje de cancelación según la razón
  const getCancellationMessage = (reason) => {
    const messages = {
      'user_cancelled': {
        title: 'Pago cancelado por el usuario',
        description: 'Decidiste cancelar el proceso de pago',
        icon: XCircle,
        color: 'text-orange-600'
      },
      'session_expired': {
        title: 'Sesión de pago expirada',
        description: 'La sesión de pago expiró por inactividad',
        icon: Clock,
        color: 'text-red-600'
      },
      'payment_failed': {
        title: 'Error en el procesamiento',
        description: 'Hubo un problema al procesar tu tarjeta',
        icon: CreditCard,
        color: 'text-red-600'
      },
      'network_error': {
        title: 'Problema de conectividad',
        description: 'Se perdió la conexión durante el pago',
        icon: Wifi,
        color: 'text-yellow-600'
      },
      'service_unavailable': {
        title: 'Servicio temporalmente no disponible',
        description: 'El servicio de pagos está experimentando problemas',
        icon: Activity,
        color: 'text-red-600'
      }
    };

    return messages[reason] || messages['user_cancelled'];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <RefreshCw className="w-10 h-10 text-orange-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Procesando información...
          </h2>
          <p className="text-gray-500">
            Verificando el estado de tu transacción
          </p>
        </motion.div>
      </div>
    );
  }

  const cancellationInfo = getCancellationMessage(cancellationReason);
  const CancellationIcon = cancellationInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header de cancelación */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-6 shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <CancellationIcon className="w-14 h-14 text-white" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Pago Cancelado
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {cancellationInfo.description}. No te preocupes, puedes intentarlo nuevamente cuando estés listo.
            </motion.p>
          </motion.div>

          {/* Información del curso (si está disponible) */}
          {course && (
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                    Curso que intentabas comprar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    {course.thumbnailUrl && (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full md:w-32 h-32 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      {course.shortDescription && (
                        <p className="text-gray-600 mb-3">
                          {course.shortDescription}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-red-600">
                          ${course.price?.toFixed(2)}
                        </span>
                        {course.isPremium && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Estado del servicio */}
          {serviceHealth && !serviceHealth.success && (
            <motion.div variants={itemVariants}>
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Problema del servicio:</strong> El sistema de pagos está experimentando dificultades técnicas.
                  Este podría ser el motivo de la cancelación. Te recomendamos intentar más tarde.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Razones posibles */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  ¿Por qué se canceló el pago?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Cancelación manual</p>
                        <p className="text-sm text-gray-600">Decidiste no completar la compra</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Sesión expirada</p>
                        <p className="text-sm text-gray-600">El tiempo de la sesión de pago se agotó</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Problema con la tarjeta</p>
                        <p className="text-sm text-gray-600">Fondos insuficientes o tarjeta bloqueada</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Wifi className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Conectividad</p>
                        <p className="text-sm text-gray-600">Problemas de conexión a internet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soluciones sugeridas */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  ¿Qué puedes hacer ahora?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <RefreshCw className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Reintentar Pago</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Vuelve al curso e intenta el proceso nuevamente
                    </p>
                    <Button
                      onClick={handleRetryPayment}
                      disabled={!courseId || (serviceHealth && !serviceHealth.success)}
                      className="w-full"
                    >
                      Intentar de Nuevo
                    </Button>
                  </div>

                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Explorar Cursos</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Descubre otros cursos disponibles
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleGoToCourses}
                      className="w-full"
                    >
                      Ver Catálogo
                    </Button>
                  </div>

                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Obtener Ayuda</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Contacta a nuestro equipo de soporte
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleContactSupport}
                      className="w-full"
                    >
                      Contactar Soporte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información de reintentos */}
          {retryAttempt > 0 && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Intento #{retryAttempt}:</strong> Si sigues teniendo problemas,
                  te recomendamos verificar tu método de pago o contactar a tu banco.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Botones de acción principales */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            {courseId && (
              <Button
                onClick={handleRetryPayment}
                size="lg"
                disabled={serviceHealth && !serviceHealth.success}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Reintentar Pago
              </Button>
            )}

            <Button
              onClick={handleGoToCourses}
              variant="outline"
              size="lg"
              className="flex-1 py-4 px-8 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explorar Cursos
            </Button>
          </motion.div>

          {/* Enlaces adicionales */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Button
              onClick={handleGoToDashboard}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-2" />
              Ir al Dashboard Principal
            </Button>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <Link to="/soporte" className="hover:text-blue-600 transition-colors">
                <Shield className="w-4 h-4 inline mr-1" />
                Centro de Ayuda
              </Link>
              <span>•</span>
              <Link to="/contacto" className="hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4 inline mr-1" />
                Soporte Técnico
              </Link>
              <span>•</span>
              <Link to="/faq" className="hover:text-blue-600 transition-colors">
                Preguntas Frecuentes
              </Link>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-800">
                💡 <strong>Consejo:</strong> Asegúrate de tener una conexión estable a internet y que tu tarjeta tenga fondos suficientes.
                <br />
                🔒 <strong>Seguridad:</strong> Todos nuestros pagos son procesados de forma segura por Stripe.
                <br />
                📞 <strong>Soporte 24/7:</strong> Estamos aquí para ayudarte en cualquier momento.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentCancel;
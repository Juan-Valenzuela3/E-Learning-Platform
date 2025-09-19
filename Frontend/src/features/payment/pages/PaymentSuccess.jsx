// Frontend/src/features/payment/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  BookOpen,
  Trophy,
  Clock,
  Download,
  Star,
  Users,
  Calendar,
  Mail,
  Shield,
  Gift,
  Sparkles,
  Home,
  Play,
  Award,
  RefreshCw
} from "lucide-react";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Progress } from "@/ui/progress";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';
import { getCourseById } from '@/services/courseService';
import { checkEnrollment } from '@/services/enrollmentService';
import PaymentService from '@/services/paymentService';
import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados principales
  const [courseId, setCourseId] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState(null);
  const [error, setError] = useState(null);
  const [showCelebration, setShowCelebration] = useState(true);

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

  // Efectos de celebración
  const triggerCelebration = () => {
    // Confetti principal
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Confetti dorado
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347']
      });
    }, 200);

    // Confetti final
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.7 }
      });
    }, 400);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        // Obtener parámetros de URL
        const courseIdParam = searchParams.get("courseId");
        const paymentIdParam = searchParams.get("paymentId");
        const sessionIdParam = searchParams.get("session_id");

        if (courseIdParam) setCourseId(courseIdParam);
        if (paymentIdParam) setPaymentId(paymentIdParam);
        if (sessionIdParam) setSessionId(sessionIdParam);

        // Cargar datos del curso
        if (courseIdParam) {
          const courseData = await getCourseById(courseIdParam);
          setCourse(courseData);

          // Verificar inscripción
          if (user?.id) {
            const enrollmentStatus = await checkEnrollment(courseIdParam, user.id);
            setEnrollmentData(enrollmentStatus);
          }
        }

        // Cargar detalles del pago si está disponible
        if (paymentIdParam && user?.id) {
          try {
            const paymentData = await PaymentService.getPaymentById(paymentIdParam);
            if (paymentData.success) {
              setPaymentDetails(paymentData.data);
            }
          } catch (error) {
            //console.warn('No se pudieron cargar los detalles del pago:', error);
            toast.error('No se pudieron cargar los detalles del pago:', error);
          }
        }

        // Limpiar información de sesión almacenada
        PaymentService.clearSessionInfo();

      } catch (error) {
        //console.error('❌ Error cargando datos del pago:', error);
        toast.error('❌ Error cargando datos del pago:', error);
        setError('Error al cargar la información del curso');
      } finally {
        setIsLoading(false);
      }
    };

    loadPaymentData();
  }, [searchParams, user]);

  // Trigger celebración después de cargar
  useEffect(() => {
    if (!isLoading && course && showCelebration) {
      setTimeout(() => {
        triggerCelebration();
        toast.success("¡Felicitaciones! Ya tienes acceso al curso.");
      }, 500);
    }
  }, [isLoading, course, showCelebration]);

  // Funciones de navegación
  const handleStartCourse = () => {
    if (courseId) {
      navigate(`/curso/${courseId}`);
    } else {
      navigate("/mis-cursos");
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoToCourses = () => {
    navigate("/mis-cursos");
  };

  const handleDownloadInvoice = async () => {
    if (paymentDetails?.id) {
      try {
        await PaymentService.downloadInvoice(paymentDetails.id);
      } catch {
        toast.error('Error al descargar la factura');
      }
    }
  };

  // Componente de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <RefreshCw className="w-10 h-10 text-green-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Confirmando tu pago...
          </h2>
          <p className="text-gray-500">
            Estamos procesando tu inscripción al curso
          </p>
        </motion.div>
      </div>
    );
  }

  // Componente de error
  if (error && !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Pago Procesado
          </h2>
          <p className="text-gray-600 mb-6">
            Tu pago fue procesado exitosamente, pero no pudimos cargar los detalles del curso.
          </p>
          <div className="space-y-3">
            <Button onClick={handleGoToCourses} className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Mis Cursos
            </Button>
            <Button variant="outline" onClick={handleGoToDashboard} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Ir al Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header de éxito con animación */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <CheckCircle className="w-14 h-14 text-white" />
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              ¡Pago Completado! 🎉
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              ¡Felicitaciones! Tu pago ha sido procesado exitosamente y ya tienes acceso completo al curso.
            </motion.p>
          </motion.div>

          {/* Información del curso */}
          {course && (
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-2 border-green-200 shadow-xl">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-medium">Nuevo Curso Desbloqueado</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{course.title}</h2>
                </div>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Información del curso */}
                    <div className="space-y-4">
                      {course.shortDescription && (
                        <p className="text-gray-600">{course.shortDescription}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {course.isPremium && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                        {course.estimatedHours && (
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {course.estimatedHours} horas
                          </Badge>
                        )}
                      </div>

                      {course.instructor && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={course.instructor.profileImageUrl} />
                            <AvatarFallback>
                              {course.instructor.userName?.charAt(0)}
                              {course.instructor.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {course.instructor.userName} {course.instructor.lastName}
                            </p>
                            <p className="text-sm text-gray-500">Instructor del curso</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Imagen del curso */}
                    <div className="flex justify-center">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full max-w-sm rounded-lg shadow-md object-cover"
                        />
                      ) : (
                        <div className="w-full max-w-sm h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Detalles del pago */}
          {paymentDetails && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Detalles de la Compra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha de compra:</span>
                        <span className="font-medium">
                          {new Date(paymentDetails.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto pagado:</span>
                        <span className="font-bold text-green-600 text-lg">
                          ${paymentDetails.amount?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID de transacción:</span>
                        <span className="font-mono text-sm">#{paymentDetails.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outline"
                        onClick={handleDownloadInvoice}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar Factura
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Beneficios desbloqueados */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  ¡Lo que acabas de desbloquear!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Acceso completo y de por vida al contenido</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Videos en alta calidad sin restricciones</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Certificado de finalización oficial</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Soporte directo del instructor</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Actualizaciones gratuitas del contenido</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Acceso desde cualquier dispositivo</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Comunidad exclusiva de estudiantes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Garantía de satisfacción 30 días</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progreso inicial */}
          {enrollmentData && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Tu Progreso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Progreso del curso:</span>
                      <span className="font-medium">{enrollmentData.progressPercentage || 0}%</span>
                    </div>
                    <Progress value={enrollmentData.progressPercentage || 0} className="h-3" />
                    <p className="text-sm text-gray-500 text-center">
                      {enrollmentData.progressPercentage === 0
                        ? "¡Perfecto momento para comenzar tu aprendizaje!"
                        : `¡Continúa donde lo dejaste!`
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Próximos pasos */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  ¿Qué sigue ahora?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Play className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 mb-1">1. Comienza a Aprender</h3>
                      <p className="text-sm text-gray-600">Accede inmediatamente a todo el contenido</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 mb-1">2. Confirma tu Email</h3>
                      <p className="text-sm text-gray-600">Recibirás la confirmación en unos minutos</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-900 mb-1">3. Únete a la Comunidad</h3>
                      <p className="text-sm text-gray-600">Conecta con otros estudiantes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Botones de acción principales */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleStartCourse}
              size="lg"
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg shadow-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              {enrollmentData?.progressPercentage > 0 ? 'Continuar Curso' : 'Comenzar Curso'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              onClick={handleGoToCourses}
              variant="outline"
              size="lg"
              className="flex-1 py-4 px-8 text-lg"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Ver Mis Cursos
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
              <Link to="/soporte" className="hover:text-green-600 transition-colors">
                <Shield className="w-4 h-4 inline mr-1" />
                Soporte 24/7
              </Link>
              <span>•</span>
              <Link to="/contacto" className="hover:text-green-600 transition-colors">
                <Mail className="w-4 h-4 inline mr-1" />
                Contáctanos
              </Link>
              <span>•</span>
              <Link to="/politicas" className="hover:text-green-600 transition-colors">
                Políticas
              </Link>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-800">
                🔒 <strong>Pago 100% Seguro:</strong> Tu transacción fue procesada de forma segura por Stripe.
                <br />
                ✉️ <strong>Confirmación:</strong> Recibirás un email con tu factura y detalles del curso.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
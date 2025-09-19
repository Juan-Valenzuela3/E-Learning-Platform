import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById } from "@/services/courseService";
import {
  Star,
  Users,
  BookOpen,
  Clock,
  Play,
  Heart,
  Share2,
  CheckCircle,
  Award,
  CirclePlay,
  Download,
  Smartphone,
  Trophy,
  User,
  ListVideo,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Globe,
  ShieldCheck,
  Tag,
  BookmarkPlus,
  Eye,
  TrendingUp,
  DollarSign,
  Zap,
  Monitor,
  Tablet,
  Smartphone as SmartphoneIcon,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import { enrollInCourse, checkEnrollment } from "@/services/enrollmentService";
import {
  generateCoursePlaceholder,
  handleImageError,
} from "@/utils/imageUtils";
import { processCoursePayment } from "@/services/stripeService";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Estados de inscripción mejorados
  const [enrollmentData, setEnrollmentData] = useState({
    isEnrolled: false,
    enrollmentId: null,
    status: null,
    progressPercentage: 0
  });

  // Estados de acciones
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        console.log("❌ No hay courseId en los parámetros");
        return;
      }

      console.log("🔍 Obteniendo curso con ID:", courseId);
      setLoading(true);
      setError(null);

      try {
        // Cargar datos del curso y verificar inscripción en paralelo
        const [courseData, enrollmentResponse] = await Promise.allSettled([
          getCourseById(courseId),
          user ? checkEnrollment(courseId) : Promise.resolve({ enrolled: false }),
        ]);

        console.log("📊 Datos del curso:", courseData);
        console.log("📋 Estado de inscripción:", enrollmentResponse);

        // Procesar datos del curso
        if (courseData.status === "fulfilled") {
          let course = courseData.value;

          // Manejar respuesta JSON en string (si aplica)
          if (course.message && typeof course.message === "string") {
            try {
              course = JSON.parse(course.message);
              console.log("✅ Datos parseados desde message:", course);
            } catch (parseError) {
              console.error("❌ Error al parsear JSON del message:", parseError);
              throw new Error("Error al procesar los datos del curso");
            }
          }

          // Normalizar datos del curso según la estructura de la API
          const normalizedCourse = {
            ...course,
            price: parseFloat(course.price) || 0,
            isPremium: (parseFloat(course.price) || 0) > 0,
            // Normalizar fechas
            createdAt: course.createdAt ? new Date(course.createdAt) : null,
            updatedAt: course.updatedAt ? new Date(course.updatedAt) : null,
            // Asegurar que youtubeUrls sea un array
            youtubeUrls: Array.isArray(course.youtubeUrls) ? course.youtubeUrls : [],
            // Normalizar instructor
            instructor: course.instructor || course.instructorid || {},
            // Normalizar categorías
            category: course.category || {},
            subcategory: course.subcategory || {},
          };

          console.log("✅ Curso normalizado:", normalizedCourse);
          setCourse(normalizedCourse);
        } else {
          console.error("❌ Error al obtener curso:", courseData.reason);
          throw new Error("No se pudo cargar el curso");
        }

        // Procesar estado de inscripción
        if (enrollmentResponse.status === "fulfilled") {
          const enrollment = enrollmentResponse.value;
          console.log("✅ Estado de inscripción obtenido:", enrollment);

          // Normalizar datos de inscripción
          const normalizedEnrollment = {
            isEnrolled: enrollment.enrolled || enrollment.isEnrolled || false,
            enrollmentId: enrollment.enrollmentId || enrollment.id || null,
            status: enrollment.status || "INACTIVE",
            progressPercentage: enrollment.progressPercentage || 0,
          };

          console.log("✅ Inscripción normalizada:", normalizedEnrollment);
          setEnrollmentData(normalizedEnrollment);
        } else {
          console.warn("⚠️ Error al verificar inscripción:", enrollmentResponse.reason);
          setEnrollmentData({
            isEnrolled: false,
            enrollmentId: null,
            status: "INACTIVE",
            progressPercentage: 0,
          });
        }
      } catch (err) {
        console.error("❌ Error al cargar el curso:", err);
        setError(err.message || "No se pudo cargar el curso. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, user]);

  // === FUNCIÓN MEJORADA PARA INSCRIPCIÓN GRATUITA ===
  const handleFreeEnrollment = async () => {
    if (!user || user.role !== "STUDENT") {
      toast.error("Por favor, inicia sesión como estudiante para inscribirte.");
      navigate("/authentication/login");
      return;
    }

    if (enrollmentData.isEnrolled) {
      toast.info("Ya estás inscrito en este curso.");
      navigate(`/curso/${courseId}/content`);
      return;
    }

    setIsEnrolling(true);
    console.log("🚀 Iniciando inscripción gratuita...");

    try {
      const enrollmentResult = await enrollInCourse(courseId);
      console.log("✅ Inscripción exitosa:", enrollmentResult);

      // Actualizar estado local
      setEnrollmentData({
        isEnrolled: true,
        enrollmentId: enrollmentResult.id,
        status: "ACTIVE",
        progressPercentage: 0,
      });

      toast.success("¡Inscripción exitosa! Ahora puedes acceder al contenido del curso.");

    } catch (error) {
      console.error("❌ Error en inscripción gratuita:", error);

      let errorMessage = "Ocurrió un error inesperado al inscribirse. Por favor, inténtalo de nuevo.";

      if (error.response?.data?.message) {
        const apiMessage = error.response.data.message;
        if (apiMessage.includes("Ya estás inscrito")) {
          setEnrollmentData(prev => ({ ...prev, isEnrolled: true }));
          errorMessage = "Ya estás inscrito en este curso. ¡Disfruta de tu aprendizaje!";
          toast.info(errorMessage);
          return;
        } else {
          errorMessage = apiMessage;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  };

  // === FUNCIÓN MEJORADA PARA PAGO DE CURSOS PREMIUM ===
  const handlePremiumPayment = async () => {
    if (!user || user.role !== "STUDENT") {
      toast.error("Por favor, inicia sesión como estudiante para comprar el curso.");
      navigate("/authentication/login");
      return;
    }

    if (!course) {
      toast.error("Información del curso no disponible.");
      return;
    }

    if (enrollmentData.isEnrolled) {
      toast.info("Ya tienes acceso a este curso.");
      navigate(`/curso/${courseId}/content`);
      return;
    }

    setIsProcessingPayment(true);
    console.log("💳 Iniciando proceso de pago premium...");

    try {
      await processCoursePayment(course, user);
      console.log("✅ Proceso de pago iniciado exitosamente");
    } catch (error) {
      console.error("❌ Error en proceso de pago:", error);
      toast.error(error.message || "Error al procesar el pago. Por favor, inténtalo de nuevo.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // === FUNCIÓN PARA CONTINUAR CURSO ===
  const handleContinueCourse = () => {
    if (!enrollmentData.isEnrolled) {
      toast.error("No tienes acceso a este curso.");
      return;
    }
    navigate(`/curso/${courseId}/content`);
  };

  // === FUNCIÓN PARA TOGGLE FAVORITOS ===
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos");
  };

  // === FUNCIÓN PARA COMPARTIR ===
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.shortDescription || course.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    }
  };

  // === FUNCIÓN PARA DETERMINAR EL TIPO DE BOTÓN ===
  const renderActionButton = () => {
    const isStudent = user && user.role === "STUDENT";

    if (!isStudent) {
      return (
        <Link
          to="/authentication/login"
          className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors text-center block"
        >
          Iniciar Sesión para {course.isPremium ? "Comprar" : "Inscribirte"}
        </Link>
      );
    }

    // Usuario autenticado como estudiante
    if (enrollmentData.isEnrolled) {
      return (
        <Button
          onClick={handleContinueCourse}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6"
        >
          <Play className="w-4 h-4 mr-2" />
          Continuar Curso
        </Button>
      );
    }

    // No inscrito - determinar si es premium o gratuito
    if (course.isPremium && course.price > 0) {
      return (
        <Button
          onClick={handlePremiumPayment}
          disabled={isProcessingPayment}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Procesando Pago...
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              Comprar Curso - ${course.price.toFixed(2)}
            </>
          )}
        </Button>
      );
    } else {
      return (
        <Button
          onClick={handleFreeEnrollment}
          disabled={isEnrolling}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6"
        >
          {isEnrolling ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Inscribiendo...
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4 mr-2" />
              Inscribirse Gratis
            </>
          )}
        </Button>
      );
    }
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-700">Cargando detalles del curso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-red-500 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-700 mb-4">Curso no encontrado.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalLectures = course.sections?.reduce(
    (sum, section) => sum + (section.lectures?.length || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón de regreso */}
      <div className="mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Regresar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna Principal - Contenido del Curso */}
        <div className="md:col-span-2">
          {/* Encabezado del Curso MEJORADO */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Breadcrumbs con categorías */}
            {(course.category?.name || course.subcategory?.name) && (
              <nav className="text-sm mb-4">
                <ol className="list-none p-0 inline-flex">
                  <li className="flex items-center">
                    <Link to="/cursos" className="text-red-500 hover:text-red-700">
                      Cursos
                    </Link>
                  </li>
                  {course.category?.name && (
                    <>
                      <li>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mx-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-500">{course.category.name}</span>
                        </div>
                      </li>
                    </>
                  )}
                  {course.subcategory?.name && (
                    <>
                      <li>
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mx-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-500">{course.subcategory.name}</span>
                        </div>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            )}

            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex-1">
                {course.title}
              </h1>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="p-2">
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? "text-red-500 fill-current" : "text-gray-500"
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="p-2">
                  <Share2 className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Descripción corta mejorada */}
            <p className="text-gray-700 leading-relaxed text-lg mb-6 break-words overflow-auto">
              {course.shortDescription || course.subtitle || course.description}
            </p>

            {/* Estadísticas del curso MEJORADAS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
                <span className="font-medium">
                  {course.rating ? course.rating.toFixed(1) : "Nuevo"}
                </span>
                <span className="ml-1 text-gray-500">
                  ({course.totalRatings || 0} valoraciones)
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                <span className="font-medium">{course.totalStudents || 0}</span>
                <span className="ml-1 text-gray-500">estudiantes</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-green-500" />
                <span className="font-medium">{course.estimatedHours || 0}h</span>
                <span className="ml-1 text-gray-500">de contenido</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <ListVideo className="w-4 h-4 mr-2 text-purple-500" />
                <span className="font-medium">{totalLectures}</span>
                <span className="ml-1 text-gray-500">lecciones</span>
              </div>
            </div>

            {/* Información del instructor MEJORADA */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {course.instructor?.userName || "N/A"} {course.instructor?.lastName || ""}
                </h3>
                <p className="text-sm text-gray-600 mb-2">Instructor del curso</p>
                {course.instructor?.email && (
                  <p className="text-xs text-gray-500">{course.instructor.email}</p>
                )}
              </div>
            </div>

            {/* Estados y fechas NUEVOS */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  Creado: {course.createdAt ? format(course.createdAt, "dd/MM/yyyy", { locale: es }) : "N/A"}
                </span>
              </div>

              {course.updatedAt && course.updatedAt > course.createdAt && (
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>
                    Actualizado: {format(course.updatedAt, "dd/MM/yyyy", { locale: es })}
                  </span>
                </div>
              )}

              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <Badge variant={course.isPublished ? "bg-green-500" : "secondary"}>
                  {course.isPublished ? "Publicado" : "Borrador"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Descripción Completa MEJORADA */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-red-500" />
              Descripción del Curso
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-auto overflow-wrap-anywhere">
                {course.description}
              </p>
            </div>
          </div>

          {/* Videos de YouTube MEJORADOS */}
          {course.youtubeUrls && course.youtubeUrls.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Play className="w-6 h-6 mr-2 text-red-500" />
                Videos de Vista Previa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.youtubeUrls.map((url, index) => (
                  <div key={index} className="aspect-video">
                    <iframe
                      src={url.replace("watch?v=", "embed/")}
                      title={`Video ${index + 1} - ${course.title}`}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requisitos del Curso MEJORADOS */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
              Requisitos
            </h2>
            <ul className="space-y-2">
              {course.requirements?.length > 0 ? (
                course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start">
                  <Zap className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">
                    No hay requisitos específicos para este curso. ¡Perfecto para principiantes!
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Columna Lateral MEJORADA */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Imagen y Video de Previsualización */}
              <div className="relative aspect-video">
                <img
                  className="w-full h-full object-cover"
                  src={course.thumbnailUrl || generateCoursePlaceholder(course.title)}
                  alt={course.title}
                  onError={handleImageError}
                />
                {course.youtubeUrls && course.youtubeUrls.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-all">
                    <Play className="w-12 h-12 text-white cursor-pointer hover:scale-110 transition-transform" />
                  </div>
                )}

                {/* Badge de Premium/Gratuito */}
                <div className="absolute top-4 left-4">
                  <Badge
                    className={`${course.isPremium
                      ? "bg-yellow-500 text-white"
                      : "bg-green-500 text-white"
                    } font-bold`}
                  >
                    {course.isPremium ? "PREMIUM" : "GRATIS"}
                  </Badge>
                </div>
              </div>

              {/* Contenido Lateral MEJORADO */}
              <div className="p-6">
                {/* Precio y tipo de curso */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 text-green-500 mr-1" />
                    <span className="text-3xl font-bold text-gray-900">
                      {course.price > 0 ? `$${course.price.toFixed(2)}` : "Gratis"}
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${course.isPremium
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                    }`}
                  >
                    {course.isPremium ? "Premium" : "Estándar"}
                  </Badge>
                </div>

                {/* Características incluidas MEJORADAS */}
                <div className="space-y-3 mb-6">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Este curso incluye:
                  </h3>

                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Play className="w-4 h-4 mr-2 text-green-500" />
                      <span>Acceso de por vida</span>
                    </div>

                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-2 text-blue-500" />
                      <span>Recursos descargables</span>
                    </div>

                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2 text-purple-500" />
                      <span>Acceso en PC</span>
                    </div>

                    <div className="flex items-center">
                      <Tablet className="w-4 h-4 mr-2 text-indigo-500" />
                      <span>Acceso en tablet</span>
                    </div>

                    <div className="flex items-center">
                      <SmartphoneIcon className="w-4 h-4 mr-2 text-pink-500" />
                      <span>Acceso móvil</span>
                    </div>

                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>Certificado de finalización</span>
                    </div>

                    <div className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                      <span>Garantía de 30 días</span>
                    </div>
                  </div>
                </div>

                {/* Botón de acción principal */}
                <div className="flex flex-col space-y-3">
                  {renderActionButton()}

                  {/* Badge de estado de inscripción MEJORADO */}
                  {enrollmentData.isEnrolled && (
                    <div className="text-center">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Inscrito - {enrollmentData.progressPercentage}% completado
                      </Badge>
                    </div>
                  )}

                  {/* Información adicional para cursos premium MEJORADA */}
                  {course.isPremium && course.price > 0 && !enrollmentData.isEnrolled && (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 mr-1 text-green-500" />
                          <span className="font-medium">Pago 100% seguro</span>
                        </div>

                        <div className="flex items-center justify-center">
                          <Globe className="w-4 h-4 mr-1 text-blue-500" />
                          <span>Procesado por Stripe</span>
                        </div>

                        <div className="flex items-center justify-center">
                          <Award className="w-4 h-4 mr-1 text-yellow-500" />
                          <span>Acceso inmediato después del pago</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Información adicional del curso */}
                  <div className="border-t pt-4 space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>ID del curso:</span>
                      <span className="font-mono">#{course.id}</span>
                    </div>

                    {course.estimatedHours && (
                      <div className="flex justify-between">
                        <span>Duración estimada:</span>
                        <span>{course.estimatedHours}h de contenido</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estado:</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${course.isActive ? "text-green-600" : "text-red-600"}`}
                      >
                        {course.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>

                    {course.createdAt && (
                      <div className="flex justify-between">
                        <span>Publicado:</span>
                        <span>{format(course.createdAt, "MMM yyyy", { locale: es })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
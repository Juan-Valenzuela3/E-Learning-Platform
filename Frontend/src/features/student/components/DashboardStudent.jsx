// === COMPONENTE DASHBOARD ESTUDIANTE MEJORADO CON DEBUGGING AVANZADO ===
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/Input";
import { Skeleton } from "@/ui/skeleton";
import {
  Search,
  BookOpen,
  Star,
  Clock,
  Bell,
  ChevronRight,
  AlertCircle,
  ShoppingCart,
  PlayCircle,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  BookOpenCheck,
  Calendar,
  Trophy,
  Zap,
  Plus,
  Eye,
  BarChart3,
  GraduationCap,
  Timer,
  Activity,
  RefreshCw,
  Database,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "react-toastify";

// === IMPORTS DE SERVICIOS ===
import {
  getActiveEnrollments,
  getCompletedEnrollments,
  updateCourseProgress,
  getAllEnrollments, // Agregar para debugging
} from "@/services/enrollmentService";
import { getCourses } from "@/services/courseService";
import { generateCoursePlaceholder } from "@/utils/imageUtils";

// === UTILIDADES DE VALIDACIÓN MEJORADAS ===
const validateEnrollmentData = (enrollments) => {
  console.log("🔍 Validando datos de inscripciones:", enrollments);

  if (!Array.isArray(enrollments)) {
    console.warn(
      "⚠️ Los datos de inscripciones no son un array:",
      typeof enrollments
    );
    return [];
  }

  const validEnrollments = enrollments.filter((enrollment) => {
    // Validar que la inscripción tenga los campos básicos
    if (!enrollment || typeof enrollment !== "object") {
      console.warn("⚠️ Inscripción inválida (no es objeto):", enrollment);
      return false;
    }

    // Validar que tenga ID
    if (!enrollment.id) {
      console.warn("⚠️ Inscripción sin ID:", enrollment);
      return false;
    }

    // Validar que tenga curso asociado
    if (!enrollment.course || typeof enrollment.course !== "object") {
      console.warn("⚠️ Inscripción sin curso válido:", enrollment);
      return false;
    }

    // Validar que el curso tenga título
    if (!enrollment.course.title || enrollment.course.title.trim() === "") {
      console.warn("⚠️ Curso sin título:", enrollment.course);
      return false;
    }

    console.log("✅ Inscripción válida:", {
      id: enrollment.id,
      courseTitle: enrollment.course.title,
      progress: enrollment.progressPercentage || 0,
      status: enrollment.status,
    });

    return true;
  });

  console.log(
    `📊 Inscripciones válidas: ${validEnrollments.length} de ${enrollments.length}`
  );
  return validEnrollments;
};

// === NUEVA FUNCIÓN DE DEBUGGING PROFUNDO ===
const debugEnrollmentData = async () => {
  console.log("🔬 === INICIANDO DEBUGGING PROFUNDO DE INSCRIPCIONES ===");

  try {
    // Probar todos los endpoints de inscripciones
    console.log("📡 Probando getActiveEnrollments...");
    const activeEnrollments = await getActiveEnrollments();
    console.log("✅ getActiveEnrollments result:", activeEnrollments);

    console.log("📡 Probando getCompletedEnrollments...");
    const completedEnrollments = await getCompletedEnrollments();
    console.log("✅ getCompletedEnrollments result:", completedEnrollments);

    console.log("📡 Probando getAllEnrollments...");
    const allEnrollments = await getAllEnrollments();
    console.log("✅ getAllEnrollments result:", allEnrollments);

    // Analizar cada tipo de respuesta
    console.log("🔍 === ANÁLISIS DETALLADO ===");
    console.log(
      "📊 Activas - Tipo:",
      typeof activeEnrollments,
      "Es Array:",
      Array.isArray(activeEnrollments)
    );
    console.log(
      "📊 Completadas - Tipo:",
      typeof completedEnrollments,
      "Es Array:",
      Array.isArray(completedEnrollments)
    );
    console.log(
      "📊 Todas - Tipo:",
      typeof allEnrollments,
      "Es Array:",
      Array.isArray(allEnrollments)
    );

    // Si getAllEnrollments funciona pero los otros no, hay un problema específico
    if (Array.isArray(allEnrollments) && allEnrollments.length > 0) {
      console.log("🎯 ¡ENCONTRÉ INSCRIPCIONES EN getAllEnrollments!");
      allEnrollments.forEach((enrollment, index) => {
        console.log(`📋 Inscripción ${index + 1}:`, {
          id: enrollment.id,
          status: enrollment.status,
          courseTitle: enrollment.course?.title,
          progress: enrollment.progressPercentage,
          enrolledAt: enrollment.enrolledAt,
        });
      });

      // Filtrar por estado manualmente para ver qué hay
      const activeOnes = allEnrollments.filter((e) => e.status === "ACTIVE");
      const completedOnes = allEnrollments.filter(
        (e) => e.status === "COMPLETED"
      );

      console.log("🟢 Inscripciones ACTIVE:", activeOnes.length);
      console.log("🟦 Inscripciones COMPLETED:", completedOnes.length);

      return {
        all: allEnrollments,
        active: activeOnes,
        completed: completedOnes,
      };
    }

    return null;
  } catch (error) {
    console.error("❌ Error en debugging profundo:", error);
    return null;
  }
};

// === ESQUELETOS DE CARGA ===
const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <Card
        key={i}
        className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const CourseCardSkeleton = () => (
  <Card className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <CardContent className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </CardContent>
  </Card>
);

// === COMPONENTE PRINCIPAL ===
export default function DashboardStudent() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Estados mejorados con mejor debugging
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("en-progreso");
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null); // Para mostrar info de debugging

  // Datos de cursos con validación mejorada
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    hoursLearned: 0,
    achievements: 0,
  });

  // === CARGAR DATOS MEJORADO CON DEBUGGING AVANZADO ===
  const loadDashboardData = async () => {
    try {
      console.log("🚀 Iniciando carga de datos del dashboard...");
      console.log("👤 Usuario autenticado:", user);
      console.log("🔐 Estado de autenticación:", isAuthenticated);

      setLoading(true);
      setError(null);

      // Verificar autenticación antes de hacer solicitudes
      if (!isAuthenticated || !user) {
        console.warn("⚠️ Usuario no autenticado, redirigiendo...");
        navigate("/authentication/login");
        return;
      }

      // PRIMER PASO: Ejecutar debugging profundo
      console.log("🔬 Ejecutando debugging profundo...");
      const debugResults = await debugEnrollmentData();
      setDebugInfo(debugResults);

      // SEGUNDO PASO: Intentar carga normal + fallback
      console.log("📡 Realizando solicitudes a la API...");

      let enrolledResponse = [];
      let completedResponse = [];

      // Intentar endpoints específicos primero
      try {
        enrolledResponse = await getActiveEnrollments();
        console.log("✅ getActiveEnrollments exitoso:", enrolledResponse);
      } catch (error) {
        console.warn("⚠️ getActiveEnrollments falló, usando fallback:", error);
        if (debugResults && debugResults.active) {
          enrolledResponse = debugResults.active;
          console.log(
            "🔄 Usando datos de fallback para activos:",
            enrolledResponse
          );
        }
      }

      try {
        completedResponse = await getCompletedEnrollments();
        console.log("✅ getCompletedEnrollments exitoso:", completedResponse);
      } catch (error) {
        console.warn(
          "⚠️ getCompletedEnrollments falló, usando fallback:",
          error
        );
        if (debugResults && debugResults.completed) {
          completedResponse = debugResults.completed;
          console.log(
            "🔄 Usando datos de fallback para completados:",
            completedResponse
          );
        }
      }

      // Cargar cursos disponibles
      const availableCoursesResponse = await getCourses().catch((err) => {
        console.error("❌ Error al cargar cursos disponibles:", err);
        return [];
      });

      console.log("📊 Respuesta cursos activos RAW:", enrolledResponse);
      console.log("📊 Respuesta cursos completados RAW:", completedResponse);
      console.log(
        "📊 Respuesta cursos disponibles RAW:",
        availableCoursesResponse
      );

      // Validar y procesar datos con funciones mejoradas
      const validEnrolledCourses = validateEnrollmentData(enrolledResponse);
      const validCompletedCourses = validateEnrollmentData(completedResponse);
      const validAvailableCourses = Array.isArray(availableCoursesResponse)
        ? availableCoursesResponse
        : [];

      console.log("✅ Cursos activos validados:", validEnrolledCourses);
      console.log("✅ Cursos completados validados:", validCompletedCourses);
      console.log("✅ Cursos disponibles validados:", validAvailableCourses);

      // Establecer estados
      setEnrolledCourses(validEnrolledCourses);
      setCompletedCourses(validCompletedCourses);

      // Cursos sugeridos (cursos disponibles que no estoy inscrito)
      const enrolledIds = validEnrolledCourses
        .map((e) => e.course?.id)
        .filter(Boolean);
      const completedIds = validCompletedCourses
        .map((e) => e.course?.id)
        .filter(Boolean);
      const takenIds = [...enrolledIds, ...completedIds];

      console.log("🔍 IDs de cursos tomados:", takenIds);

      const suggested = validAvailableCourses.filter(
        (course) =>
          course &&
          course.id &&
          !takenIds.includes(course.id) &&
          course.isPublished &&
          course.isActive
      );

      console.log("💡 Cursos sugeridos:", suggested);
      setSuggestedCourses(suggested.slice(0, 8));

      // Calcular estadísticas mejoradas
      const totalHours = validEnrolledCourses.reduce((acc, enrollment) => {
        const estimatedHours = enrollment.course?.estimatedHours || 0;
        const progress = enrollment.progressPercentage || 0;
        return acc + (estimatedHours * progress) / 100;
      }, 0);

      const newStats = {
        inProgress: validEnrolledCourses.length,
        completed: validCompletedCourses.length,
        hoursLearned: Math.round(totalHours),
        achievements: validCompletedCourses.length,
      };

      console.log("📈 Estadísticas calculadas:", newStats);
      setStats(newStats);

      // Mostrar mensaje de éxito si hay datos
      if (validEnrolledCourses.length > 0 || validCompletedCourses.length > 0) {
        toast.success(
          `Dashboard cargado: ${validEnrolledCourses.length} cursos activos, ${validCompletedCourses.length} completados`
        );
      } else {
        console.log("ℹ️ No se encontraron cursos inscritos");

        // Mostrar información de debugging si hay datos en getAllEnrollments
        if (debugResults && debugResults.all && debugResults.all.length > 0) {
          toast.warning(
            `Se encontraron ${debugResults.all.length} inscripciones en total, pero ninguna activa. Revisa la consola para más detalles.`
          );
        } else {
          toast.info("No tienes cursos inscritos aún");
        }
      }
    } catch (error) {
      console.error("💥 Error crítico al cargar datos del dashboard:", error);
      setError("Error al cargar los datos del dashboard");
      toast.error("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
      console.log("✅ Carga de dashboard completada");
    }
  };

  // Efecto para cargar datos cuando el usuario esté disponible
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    } else if (!isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // === FILTRAR CURSOS MEJORADO ===
  const filteredEnrolledCourses = enrolledCourses.filter((enrollment) => {
    if (!enrollment || !enrollment.course) return false;

    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) return true; // Si no hay término de búsqueda, mostrar todos

    const title = enrollment.course.title?.toLowerCase() || "";
    const instructorName =
      enrollment.course.instructor?.userName?.toLowerCase() || "";
    const instructorLastName =
      enrollment.course.instructor?.lastName?.toLowerCase() || "";

    return (
      title.includes(searchTermLower) ||
      instructorName.includes(searchTermLower) ||
      instructorLastName.includes(searchTermLower)
    );
  });

  console.log("🔍 Cursos filtrados:", {
    total: enrolledCourses.length,
    filtered: filteredEnrolledCourses.length,
    searchTerm,
  });

  // === TARJETA DE CURSO INSCRITO MEJORADA ===
  const EnrolledCourseCard = ({ enrollment }) => {
    const [updating, setUpdating] = useState(false);

    // Validación más estricta
    if (!enrollment || !enrollment.course || !enrollment.id) {
      console.warn(
        "⚠️ EnrolledCourseCard: Datos de inscripción inválidos",
        enrollment
      );
      return null;
    }

    const handleUpdateProgress = async (newProgress) => {
      try {
        setUpdating(true);
        console.log("📈 Actualizando progreso:", {
          enrollmentId: enrollment.id,
          newProgress,
        });

        await updateCourseProgress(enrollment.id, newProgress);

        // Actualizar localmente
        setEnrolledCourses((prev) =>
          prev.map((e) =>
            e.id === enrollment.id
              ? { ...e, progressPercentage: newProgress }
              : e
          )
        );

        toast.success("Progreso actualizado correctamente");
      } catch (error) {
        console.error("❌ Error al actualizar progreso:", error);
        toast.error("Error al actualizar el progreso");
      } finally {
        setUpdating(false);
      }
    };

    const course = enrollment.course;
    const progress = enrollment.progressPercentage || 0;

    return (
      <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative">
          <img
            src={course.thumbnailUrl || generateCoursePlaceholder(course.title)}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = generateCoursePlaceholder(course.title);
            }}
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-red-500 text-white font-semibold">
              {progress}% completado
            </Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-500 text-white text-xs">
              {enrollment.status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>

          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>
              {course.instructor?.userName || "Instructor"}{" "}
              {course.instructor?.lastName || ""}
            </span>
          </div>

          {/* Barra de Progreso */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso
              </span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-gray-200"
              indicatorClassName="bg-red-500"
            />
          </div>

          {/* Información de debugging
          <div className="mb-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            ID: {enrollment.id} | Inscrito:{" "}
            {enrollment.enrolledAt
              ? format(new Date(enrollment.enrolledAt), "dd/MM/yyyy")
              : "N/A"}
          </div>
*/}
          {/* Acciones */}
          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold">
              <Link to={`/course/${course.id}`}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Continuar
              </Link>
            </Button>

            {progress < 100 && (
              <Button
                variant="outline"
                onClick={() =>
                  handleUpdateProgress(Math.min(100, progress + 10))
                }
                disabled={updating}
                className="border-red-500 text-red-500 hover:bg-red-50">
                {updating ? (
                  <Timer className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // === TARJETA DE CURSO SUGERIDO ===
  const SuggestedCourseCard = ({ course }) => (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={course.thumbnailUrl || generateCoursePlaceholder(course.title)}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = generateCoursePlaceholder(course.title);
          }}
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-500 text-white font-semibold">Nuevo</Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            {course.instructor?.userName || "Instructor"}{" "}
            {course.instructor?.lastName || ""}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">4.8</span>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{course.estimatedHours || 10}h</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-red-500">
            ${course.price || 0}
          </span>

          <Button
            asChild
            className="bg-red-500 hover:bg-red-600 text-white font-semibold">
            <Link to={`/curso/${course.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Ver Curso
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // === PANEL DE DEBUGGING ===
  {/*
  const DebugPanel = () => {
    if (!debugInfo) return null;

    return (
      <Card className="bg-yellow-50 border-yellow-200 mb-6">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Información de Debugging
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold text-yellow-800">
                Total de Inscripciones:
              </p>
              <p className="text-yellow-700">{debugInfo.all?.length || 0}</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-800">Estado ACTIVE:</p>
              <p className="text-yellow-700">{debugInfo.active?.length || 0}</p>
            </div>
            <div>
              <p className="font-semibold text-yellow-800">Estado COMPLETED:</p>
              <p className="text-yellow-700">
                {debugInfo.completed?.length || 0}
              </p>
            </div>
          </div>

          {debugInfo.all && debugInfo.all.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold text-yellow-800 mb-2">
                Detalles de Inscripciones:
              </p>
              <div className="max-h-32 overflow-y-auto bg-white p-2 rounded border">
                {debugInfo.all.map((enrollment, index) => (
                  <div key={index} className="text-xs mb-1">
                    <span className="font-mono">ID:{enrollment.id}</span> |
                    <span className="ml-1">{enrollment.status}</span> |
                    <span className="ml-1">
                      {enrollment.course?.title || "Sin título"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  */}

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <DashboardSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 p-6 flex items-center justify-center">
        <Card className="bg-white rounded-xl shadow-xl border border-red-200 max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error al cargar datos
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => {
                setError(null);
                loadDashboardData();
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto p-6 relative">
        {/* === HEADER === */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¡Hola, <span className="text-red-500">{user?.userName}!</span>
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
              </p>
              <p className="text-lg text-gray-500">
                Continúa tu viaje de aprendizaje 🚀
              </p>
            </div>

            {/* Botón de recarga con debugging */}
            <Button
              onClick={loadDashboardData}
              variant="outline"
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50">
              <RefreshCw className="h-4 w-4" />
              Recargar Dashboard
            </Button>
          </div>
        </div>

        {/* === PANEL DE DEBUGGING ===
        <DebugPanel />

        {/* === ESTADÍSTICAS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <BookOpen className="h-8 w-8 text-red-600" />
                </div>
                <Badge className="bg-red-50 text-red-600 font-semibold">
                  +{stats.inProgress > 0 ? "2" : "0"} esta semana
                </Badge>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.inProgress}
              </h3>
              <p className="text-gray-600">Cursos en progreso</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <Badge className="bg-green-50 text-green-600 font-semibold">
                  +{stats.completed > 0 ? "1" : "0"} este mes
                </Badge>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.completed}
              </h3>
              <p className="text-gray-600">Cursos completados</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <Badge className="bg-blue-50 text-blue-600 font-semibold">
                  +5h esta semana
                </Badge>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.hoursLearned}h
              </h3>
              <p className="text-gray-600">Horas aprendidas</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <Badge className="bg-yellow-50 text-yellow-600 font-semibold">
                  +{stats.achievements > 0 ? "2" : "0"} este mes
                </Badge>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">
                {stats.achievements}
              </h3>
              <p className="text-gray-600">Logros</p>
            </CardContent>
          </Card>
        </div>

        {/* === CONTENIDO PRINCIPAL === */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Columna principal - Cursos */}
          <div className="xl:col-span-2 space-y-8">
            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar en tus cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-red-500 focus:ring-0 rounded-xl transition-all duration-300"
              />
            </div>

            {/* Mis Cursos - SECCIÓN MEJORADA */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <BookOpenCheck className="h-8 w-8 text-red-600" />
                  </div>
                  Mis Cursos
                  {enrolledCourses.length > 0 && (
                    <Badge className="bg-red-100 text-red-700 font-semibold ml-2">
                      {enrolledCourses.length}
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-gray-600">
                  {enrolledCourses.length > 0
                    ? `Tienes ${enrolledCourses.length} curso${
                        enrolledCourses.length > 1 ? "s" : ""
                      } en progreso`
                    : "Continúa donde lo dejaste"}
                </p>
              </CardHeader>
              <CardContent>
                {filteredEnrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredEnrolledCourses.map((enrollment) => (
                      <EnrolledCourseCard
                        key={enrollment.id}
                        enrollment={enrollment}
                      />
                    ))}
                  </div>
                ) : enrolledCourses.length > 0 && searchTerm ? (
                  // Mostrar mensaje cuando hay cursos pero no coinciden con la búsqueda
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No se encontraron cursos
                    </h3>
                    <p className="text-gray-600 mb-6">
                      No hay cursos que coincidan con "{searchTerm}"
                    </p>
                    <Button
                      onClick={() => setSearchTerm("")}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50">
                      Limpiar búsqueda
                    </Button>
                  </div>
                ) : (
                  // Mostrar mensaje cuando no hay cursos inscritos
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No tienes cursos inscritos
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Explora nuestro catálogo y comienza tu viaje de
                      aprendizaje
                    </p>

                    {/* Información adicional si hay debugging data
                    {debugInfo && debugInfo.all && debugInfo.all.length > 0 && (
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          🔍 Se encontraron {debugInfo.all.length} inscripciones
                          en total, pero {debugInfo.active?.length || 0} con
                          estado ACTIVE. Revisa el panel de debugging arriba
                          para más detalles.
                        </p>
                      </div>
                    )}
*/}
                    <Button
                      asChild
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3">
                      <Link to="/cursos">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Explorar Cursos
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resto del componente se mantiene igual... */}
            {/* Cursos Sugeridos */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl flex items-center gap-3 text-gray-900">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  Cursos Recomendados
                </CardTitle>
                <p className="text-gray-600">
                  Descubre nuevos cursos para continuar aprendiendo
                </p>
              </CardHeader>
              <CardContent>
                {suggestedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedCourses.slice(0, 6).map((course) => (
                      <SuggestedCourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No hay cursos disponibles
                    </h3>
                    <p className="text-gray-600">
                      Vuelve pronto para ver nuevas recomendaciones
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - resto del código igual... */}
          <div className="space-y-6">
            {/* Actividad Reciente */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedCourses.slice(0, 3).map((course, index) => (
                    <div
                      key={course.id || index}
                      className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Completaste "{course.course?.title || "Curso"}"
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.completedAt
                            ? format(new Date(course.completedAt), "d MMM", {
                                locale: es,
                              })
                            : "Recientemente"}
                        </p>
                      </div>
                    </div>
                  ))}

                  {completedCourses.length === 0 && (
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No hay actividad reciente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Logros */}
            <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.completed > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                      <Trophy className="h-10 w-10 text-yellow-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Primer Curso Completado
                        </p>
                        <p className="text-sm text-gray-600">
                          ¡Felicitaciones!
                        </p>
                      </div>
                    </div>
                  )}

                  {stats.inProgress >= 3 && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <Target className="h-10 w-10 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Estudiante Activo
                        </p>
                        <p className="text-sm text-gray-600">
                          3+ cursos en progreso
                        </p>
                      </div>
                    </div>
                  )}

                  {stats.hoursLearned >= 10 && (
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                      <GraduationCap className="h-10 w-10 text-red-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Dedicación Total
                        </p>
                        <p className="text-sm text-gray-600">
                          10+ horas de estudio
                        </p>
                      </div>
                    </div>
                  )}

                  {stats.completed === 0 && stats.inProgress === 0 && (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">
                        Completa cursos para ganar logros
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Frontend/src/features/student/components/PurchasedCourses.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/Select";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  Award,
  Star,
  AlertCircle,
  PlayCircle,
  X,
  CheckCircle,
  User,
  Calendar,
  TrendingUp,
  Target,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  RefreshCw,
  Download,
  Share2,
  Heart,
  MoreVertical,
  Loader2,
  Trophy,
  Bookmark,
  Eye,
  ChevronDown,
  ArrowUpDown,
  Play,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  getActiveEnrollments,
  getCompletedEnrollments,
  getEnrolledCourses,
  unenrollFromCourse,
} from "@/services/enrollmentService";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import { getCourseById } from "@/services/courseService";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

// === CONSTANTES ===
const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
};

const SORT_OPTIONS = {
  RECENT: "recent",
  PROGRESS: "progress",
  TITLE: "title",
  STATUS: "status",
};

const FILTER_OPTIONS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
  NOT_STARTED: "not-started",
};

export default function PurchasedCourses() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // === ESTADOS PRINCIPALES ===
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // === ESTADOS DE UI ===
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(FILTER_OPTIONS.ALL);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECENT);
  const [sortOrder, setSortOrder] = useState("desc");

  // === ESTADOS DE ACCIONES ===
  const [loadingCourses, setLoadingCourses] = useState(new Set());
  const [unenrollingCourses, setUnenrollingCourses] = useState(new Set());
  const [selectedCourses, setSelectedCourses] = useState(new Set());

  const currentPath = location.pathname;

  // === FUNCIONES DE CARGA DE DATOS ===
  const fetchCourseData = useCallback(async (courseId) => {
    try {
      console.log("🔍 Obteniendo datos del curso:", courseId);
      const courseData = await getCourseById(courseId);
      console.log("✅ Datos del curso obtenidos:", courseData);
      return courseData;
    } catch (error) {
      console.error("❌ Error al obtener datos del curso:", error);
      return null;
    }
  }, []);

  const enrichCourseData = useCallback(
    async (enrollments) => {
      const enrichedCourses = [];

      for (const enrollment of enrollments) {
        let courseData = enrollment.course;

        if (!courseData || !courseData.title) {
          console.log("📚 Enriqueciendo datos del curso:", enrollment.id);
          setLoadingCourses((prev) => new Set([...prev, enrollment.id]));

          const fetchedCourseData = await fetchCourseData(enrollment.id);
          if (fetchedCourseData) {
            courseData = fetchedCourseData;
          }

          setLoadingCourses((prev) => {
            const newSet = new Set(prev);
            newSet.delete(enrollment.id);
            return newSet;
          });
        }

        enrichedCourses.push({
          ...enrollment,
          course: courseData,
          // Normalizar fechas
          enrollmentDate: enrollment.enrollmentDate
            ? new Date(enrollment.enrollmentDate)
            : new Date(),
          lastAccessed: enrollment.lastAccessed
            ? new Date(enrollment.lastAccessed)
            : null,
          completedAt: enrollment.completedAt
            ? new Date(enrollment.completedAt)
            : null,
        });
      }

      return enrichedCourses;
    },
    [fetchCourseData]
  );

  // Reemplazar la función loadCourseDetails con esta versión mejorada
  const loadCourseDetails = useCallback(async (enrollment) => {
    // Validar que la inscripción tenga courseId
    if (!enrollment.courseId) {
      console.warn("⚠️ Inscripción sin courseId válido:", enrollment);
      return createFallbackCourse(enrollment);
    }

    try {
      console.log(`🔍 Cargando detalles del curso ID: ${enrollment.courseId}`);
      const courseData = await getCourseById(enrollment.courseId);

      if (!courseData) {
        console.warn(`⚠️ Curso no encontrado para ID: ${enrollment.courseId}`);
        return createFallbackCourse(enrollment);
      }

      console.log(`✅ Curso cargado exitosamente:`, courseData.title);
      return courseData;
    } catch (error) {
      console.error(
        `❌ Error al cargar curso ID ${enrollment.courseId}:`,
        error
      );

      // Verificar si es un error 404 (curso no encontrado) o 500 (error del servidor)
      if (
        error.message?.includes("404") ||
        error.message?.includes("No encontrado")
      ) {
        console.warn(
          `⚠️ Curso con ID ${enrollment.courseId} no existe en la base de datos`
        );
        return createFallbackCourse(enrollment, "not_found");
      } else {
        console.error(
          `❌ Error del servidor al cargar curso ID ${enrollment.courseId}`
        );
        return createFallbackCourse(enrollment, "server_error");
      }
    }
  }, []);

  // Función auxiliar para crear un curso de respaldo
  const createFallbackCourse = (enrollment, errorType = "unknown") => {
    const baseCourse = {
      id: enrollment.courseId || "unknown",
      title: `Curso no disponible (ID: ${enrollment.courseId || "N/A"})`,
      description: "Este curso no está disponible en este momento.",
      shortDescription: "Curso no disponible",
      thumbnailUrl: null,
      price: 0,
      isPremium: false,
      isPublished: false,
      isActive: false,
      estimatedHours: 0,
      instructor: {
        userName: "Instructor",
        lastName: "No disponible",
        email: "noreply@example.com",
      },
      category: { name: "No disponible" },
      subcategory: { name: "No disponible" },
      youtubeUrls: [],
      createdAt: enrollment.enrolledAt || new Date().toISOString(),
      updatedAt: enrollment.enrolledAt || new Date().toISOString(),
    };

    // Personalizar mensaje según el tipo de error
    switch (errorType) {
      case "not_found":
        baseCourse.title = `Curso eliminado (ID: ${enrollment.courseId})`;
        baseCourse.description =
          "Este curso ha sido eliminado de la plataforma.";
        break;
      case "server_error":
        baseCourse.title = `Error al cargar curso (ID: ${enrollment.courseId})`;
        baseCourse.description =
          "Error temporal del servidor. Intenta más tarde.";
        break;
      default:
        baseCourse.title = `Curso no disponible (ID: ${enrollment.courseId})`;
        baseCourse.description =
          "Este curso no está disponible en este momento.";
    }

    return baseCourse;
  };

  // Función mejorada para cargar todos los cursos
  const loadAllCourses = useCallback(async () => {
    try {
      console.log("�� Iniciando carga de cursos comprados...");

      // Obtener inscripciones
      const enrollments = await getActiveStudentEnrollments();
      console.log(`📚 Encontradas ${enrollments?.length || 0} inscripciones`);

      if (!enrollments || enrollments.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      // Cargar detalles de cada curso en paralelo
      const coursePromises = enrollments.map((enrollment) =>
        loadCourseDetails(enrollment).catch((error) => {
          console.error(
            `❌ Error al cargar curso para inscripción ${enrollment.id}:`,
            error
          );
          return createFallbackCourse(enrollment, "load_error");
        })
      );

      const courseResults = await Promise.allSettled(coursePromises);

      // Filtrar solo los cursos que se cargaron exitosamente
      const validCourses = courseResults
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => result.value);

      console.log(
        `✅ Cargados ${validCourses.length} cursos de ${enrollments.length} inscripciones`
      );

      setCourses(validCourses);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error al cargar cursos:", error);
      setError("Error al cargar los cursos. Intenta más tarde.");
      setLoading(false);
    }
  }, [loadCourseDetails]);

  // Función mejorada para cargar cursos completados
  const loadCompletedCourses = useCallback(async () => {
    try {
      console.log("�� Iniciando carga de cursos completados...");

      const enrollments = await getCompletedStudentEnrollments();
      console.log(
        `🏆 Encontrados ${enrollments?.length || 0} cursos completados`
      );

      if (!enrollments || enrollments.length === 0) {
        setCompletedCourses([]);
        setLoadingCompleted(false);
        return;
      }

      const coursePromises = enrollments.map((enrollment) =>
        loadCourseDetails(enrollment).catch((error) => {
          console.error(
            `❌ Error al cargar curso completado ${enrollment.id}:`,
            error
          );
          return createFallbackCourse(enrollment, "load_error");
        })
      );

      const courseResults = await Promise.allSettled(coursePromises);

      const validCourses = courseResults
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => result.value);

      console.log(`✅ Cargados ${validCourses.length} cursos completados`);

      setCompletedCourses(validCourses);
      setLoadingCompleted(false);
    } catch (error) {
      console.error("❌ Error al cargar cursos completados:", error);
      setError("Error al cargar los cursos completados. Intenta más tarde.");
      setLoadingCompleted(false);
    }
  }, [loadCourseDetails]);

  // === EFECTOS ===
  useEffect(() => {
    loadAllCourses();
  }, [loadAllCourses]);

  useEffect(() => {
    loadCompletedCourses();
  }, [loadCompletedCourses]);

  // === FUNCIONES DE ACCIÓN ===
  const handleUnenrollCourse = useCallback(
    async (enrollmentId, courseTitle) => {
      try {
        const confirmed = window.confirm(
          `¿Estás seguro de que quieres desinscribirte del curso "${courseTitle}"?\n\nEsta acción no se puede deshacer.`
        );

        if (!confirmed) return;

        setUnenrollingCourses((prev) => new Set([...prev, enrollmentId]));

        await unenrollFromCourse(enrollmentId);

        setCourses((prev) =>
          prev.filter((course) => course.id !== enrollmentId)
        );
        toast.success("Te has desinscrito exitosamente del curso");
      } catch (err) {
        console.error("❌ Error al desinscribirse del curso:", err);
        toast.error(err.message || "Error al desinscribirse del curso");
      } finally {
        setUnenrollingCourses((prev) => {
          const newSet = new Set(prev);
          newSet.delete(enrollmentId);
          return newSet;
        });
      }
    },
    []
  );

  const handleContinueCourse = useCallback(
    (courseId) => {
      try {
        console.log("▶️ Continuando curso:", courseId);
        navigate(`/curso/${courseId}`);
      } catch (err) {
        console.error("❌ Error al continuar curso:", err);
        toast.error("Error al continuar el curso");
      }
    },
    [navigate]
  );

  const handleRefresh = useCallback(() => {
    loadAllCourses();
  }, [loadAllCourses]);

  // === LÓGICA DE FILTRADO Y ORDENAMIENTO ===
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const courseData = course.course || course;

      // Filtro de búsqueda
      const matchesSearch =
        !searchTerm ||
        courseData.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseData.instructor?.userName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        courseData.instructor?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Filtro de estado
      let matchesFilter = true;
      switch (filterStatus) {
        case FILTER_OPTIONS.ACTIVE:
          matchesFilter = course.status === "ACTIVE";
          break;
        case FILTER_OPTIONS.COMPLETED:
          matchesFilter = course.status === "COMPLETED";
          break;
        case FILTER_OPTIONS.NOT_STARTED:
          matchesFilter = (course.progressPercentage || 0) === 0;
          break;
        default:
          matchesFilter = true;
      }

      return matchesSearch && matchesFilter;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case SORT_OPTIONS.TITLE:
          comparison = (a.course?.title || "").localeCompare(
            b.course?.title || ""
          );
          break;
        case SORT_OPTIONS.PROGRESS:
          comparison =
            (a.progressPercentage || 0) - (b.progressPercentage || 0);
          break;
        case SORT_OPTIONS.STATUS:
          comparison = (a.status || "").localeCompare(b.status || "");
          break;
        case SORT_OPTIONS.RECENT:
        default:
          comparison =
            new Date(a.enrollmentDate || 0) - new Date(b.enrollmentDate || 0);
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [courses, searchTerm, filterStatus, sortBy, sortOrder]);

  // === ESTADÍSTICAS ===
  const stats = useMemo(
    () => ({
      total: courses.length,
      active: courses.filter((c) => c.status === "ACTIVE").length,
      completed: courses.filter((c) => c.status === "COMPLETED").length,
      notStarted: courses.filter((c) => (c.progressPercentage || 0) === 0)
        .length,
      avgProgress:
        courses.length > 0
          ? Math.round(
              courses.reduce((sum, c) => sum + (c.progressPercentage || 0), 0) /
                courses.length
            )
          : 0,
    }),
    [courses]
  );

  // === FUNCIONES DE UI ===
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus(FILTER_OPTIONS.ALL);
    setSortBy(SORT_OPTIONS.RECENT);
    setSortOrder("desc");
    toast.info("Filtros limpiados");
  };

  // === COMPONENTE DE CURSO ===
  const CourseCard = ({ course, index }) => {
    const courseData = course.course || course;
    const progressPercentage = course.progressPercentage || 0;
    const status = course.status || "ACTIVE";
    const enrollmentId = course.id;
    const courseId = courseData?.id || course.id;
    const isLoading = loadingCourses.has(enrollmentId);
    const isUnenrolling = unenrollingCourses.has(enrollmentId);

    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 animate-pulse"></div>
            <div className="h-2 bg-gray-200 rounded mb-4 animate-pulse"></div>
          </div>
        </motion.div>
      );
    }

    if (!courseData || !courseData.title) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
          <div className="h-48 bg-red-50 flex items-center justify-center">
            <div className="text-center text-red-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Error al cargar curso</p>
            </div>
          </div>
        </motion.div>
      );
    }

    const cardContent = (
      <>
        {/* Imagen del curso */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              courseData.thumbnailUrl ||
              generateCoursePlaceholder(courseData.title)
            }
            alt={courseData.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge
              className={`${
                status === "COMPLETED" ? "bg-green-500" : "bg-blue-500"
              } text-white px-3 py-1 text-xs font-semibold shadow-lg`}>
              {status === "COMPLETED" ? "Completado" : "En Progreso"}
            </Badge>

            {progressPercentage > 0 && (
              <Badge className="bg-red-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                {progressPercentage}%
              </Badge>
            )}
          </div>

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Título y descripción */}
          <div className="flex-1 mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors break-words">
              {courseData.title}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2 break-words">
              {courseData.shortDescription ||
                courseData.description ||
                "Sin descripción disponible"}
            </p>

            {/* Instructor */}
            {courseData.instructor && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <User className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="break-words">
                  {courseData.instructor.userName}{" "}
                  {courseData.instructor.lastName}
                </span>
              </div>
            )}
          </div>

          {/* Progreso */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso
              </span>
              <span className="text-sm font-bold text-gray-900">
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Metadatos */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {course.enrollmentDate
                  ? formatDistanceToNow(course.enrollmentDate, {
                      addSuffix: true,
                      locale: es,
                    })
                  : "Fecha no disponible"}
              </span>
            </div>

            {course.lastAccessed && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                <span>
                  {formatDistanceToNow(course.lastAccessed, {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              onClick={() => handleContinueCourse(courseId)}
              className={`flex-1 ${
                status === "COMPLETED"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              } text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105`}
              disabled={isUnenrolling}>
              {status === "COMPLETED" ? (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Ver de Nuevo
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {progressPercentage === 0 ? "Comenzar" : "Continuar"}
                </>
              )}
            </Button>

            {/* Menú de opciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 border-gray-300 hover:bg-gray-50 rounded-xl"
                  disabled={isUnenrolling}>
                  {isUnenrolling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MoreVertical className="w-4 h-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleContinueCourse(courseId)}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Ir al Curso
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Heart className="w-4 h-4 mr-2" />
                  Agregar a Favoritos
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    handleUnenrollCourse(enrollmentId, courseData.title)
                  }
                  className="text-red-600 focus:text-red-600">
                  <X className="w-4 h-4 mr-2" />
                  Desinscribirse
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </>
    );

    if (viewMode === VIEW_MODES.LIST) {
      return (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="flex">
            <div className="w-32 h-24 flex-shrink-0">
              <img
                src={
                  courseData.thumbnailUrl ||
                  generateCoursePlaceholder(courseData.title)
                }
                alt={courseData.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 p-4 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <h3 className="font-semibold text-gray-900 mb-1 break-words">
                  {courseData.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 break-words">
                  {progressPercentage}% completado
                </p>
                <div className="w-32">
                  <Progress value={progressPercentage} className="h-1" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }>
                  {status === "COMPLETED" ? "Completado" : "En Progreso"}
                </Badge>
                <Button
                  onClick={() => handleContinueCourse(courseId)}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white">
                  <PlayCircle className="w-4 h-4 mr-1" />
                  {status === "COMPLETED" ? "Ver" : "Continuar"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
        {cardContent}
      </motion.div>
    );
  };

  // === COMPONENTES DE ESTADO ===
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar cursos
          </h3>
          <p className="text-gray-600 mb-6 break-words">{error}</p>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
            <Button
              onClick={() => navigate("/cursos")}
              variant="outline"
              className="flex-1">
              <BookOpen className="w-4 h-4 mr-2" />
              Explorar Cursos
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center border border-gray-100">
          <BookOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4 break-words">
            {currentPath.includes("en-progreso") &&
              "No tienes cursos en progreso"}
            {currentPath.includes("completados") &&
              "No tienes cursos completados aún"}
            {!currentPath.includes("en-progreso") &&
              !currentPath.includes("completados") &&
              "No tienes cursos inscritos"}
          </h3>
          <p className="text-lg text-gray-600 mb-8 break-words">
            {currentPath.includes("en-progreso") &&
              "Inscríbete en algunos cursos y comienza tu aprendizaje."}
            {currentPath.includes("completados") &&
              "Completa algunos cursos para verlos aquí."}
            {!currentPath.includes("en-progreso") &&
              !currentPath.includes("completados") &&
              "Explora nuestros cursos disponibles y comienza tu viaje de aprendizaje."}
          </p>
          <Link
            to="/cursos"
            className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <BookOpen className="w-5 h-5 mr-2" />
            Explorar Cursos
          </Link>
        </motion.div>
      </div>
    );
  }

  // === RENDER PRINCIPAL ===
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
                {currentPath.includes("en-progreso") && "Cursos en Progreso"}
                {currentPath.includes("completados") && "Cursos Completados"}
                {!currentPath.includes("en-progreso") &&
                  !currentPath.includes("completados") &&
                  "Mis Cursos"}
              </h1>
              <p className="text-gray-600 text-base md:text-lg break-words">
                {currentPath.includes("en-progreso") &&
                  "Continúa tu aprendizaje donde lo dejaste"}
                {currentPath.includes("completados") &&
                  "Revisa tus logros y conocimientos adquiridos"}
                {!currentPath.includes("en-progreso") &&
                  !currentPath.includes("completados") &&
                  "Gestiona todos tus cursos inscritos"}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button
                onClick={handleRefresh}
                variant="outline"
                disabled={refreshing}
                className="flex items-center gap-2">
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Actualizando..." : "Actualizar"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Activos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.active}
                </p>
              </div>
              <PlayCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completados</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sin empezar</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.notStarted}
                </p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Progreso</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.avgProgress}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Controles de filtrado y vista */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 md:p-6 mb-8 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar cursos por título o instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filtros y controles */}
            <div className="flex flex-wrap gap-2">
              {/* Filtro de estado */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="w-40">
                  <SelectItem value={FILTER_OPTIONS.ALL}>Todos</SelectItem>
                  <SelectItem value={FILTER_OPTIONS.ACTIVE}>
                    En Progreso
                  </SelectItem>
                  <SelectItem value={FILTER_OPTIONS.COMPLETED}>
                    Completados
                  </SelectItem>
                  <SelectItem value={FILTER_OPTIONS.NOT_STARTED}>
                    Sin Empezar
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Ordenamiento */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="progress">Progreso</SelectItem>
                  <SelectItem value="enrollmentDate">
                    Fecha de inscripción
                  </SelectItem>
                  <SelectItem value="price">Precio</SelectItem>
                </SelectContent>
              </Select>

              {/* Toggle orden */}
              <Button
                onClick={toggleSortOrder}
                variant="outline"
                className="px-3">
                {sortOrder === "asc" ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>

              {/* Modo de vista */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <Button
                  onClick={() => setViewMode(VIEW_MODES.GRID)}
                  variant={viewMode === VIEW_MODES.GRID ? "default" : "ghost"}
                  className="px-3 rounded-none">
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setViewMode(VIEW_MODES.LIST)}
                  variant={viewMode === VIEW_MODES.LIST ? "default" : "ghost"}
                  className="px-3 rounded-none border-l">
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Limpiar filtros */}
              {(searchTerm ||
                filterStatus !== FILTER_OPTIONS.ALL ||
                sortBy !== SORT_OPTIONS.RECENT) && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50">
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Lista de cursos */}
        <AnimatePresence mode="wait">
          {filteredAndSortedCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-gray-600 mb-4 break-words">
                Intenta con otros términos de búsqueda o cambia los filtros.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar filtros
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={
                viewMode === VIEW_MODES.GRID
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                  : "space-y-4"
              }>
              {filteredAndSortedCourses.map((course, index) => (
                <CourseCard
                  key={`${course.id}-${index}`}
                  course={course}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Información de resultados */}
        {filteredAndSortedCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-gray-600">
            <p>
              Mostrando {filteredAndSortedCourses.length} de {courses.length}{" "}
              cursos
              {searchTerm && (
                <span>
                  {" "}
                  para "<strong className="break-words">{searchTerm}</strong>"
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Play,
  Clock,
  Award,
  BookOpen,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { getCourseById } from "@/services/courseService";
import { getCourseVideos } from "@/services/courseVideoService";
import {
  checkEnrollment,
  updateCourseProgress,
  markCourseAsCompleted,
} from "@/services/enrollmentService";
// import { useAuth } from "@/shared/hooks/useAuth"; // No se usa actualmente
import { toast } from "sonner";

const RETRY_INTERVAL = 2000; // ms
const MAX_RETRIES = 10;

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth(); // No se usa actualmente

  // Estados para datos del curso
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [retryingEnrollment, setRetryingEnrollment] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para UI
  const [isClient, setIsClient] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedModules, setExpandedModules] = useState([1]);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const loadCourseData = useCallback(async (retrying = false) => {
    setLoading(true);
    setError(null);
    try {
      const [courseData, videosData, enrollmentData] = await Promise.allSettled([
        getCourseById(courseId),
        getCourseVideos(courseId),
        checkEnrollment(courseId),
      ]);

      // Procesar datos del curso
      if (courseData.status === "fulfilled") {
        setCourse(courseData.value);
      } else {
        throw new Error("Error al cargar el curso");
      }

      // Procesar videos
      if (videosData.status === "fulfilled") {
        setVideos(videosData.value || []);
        // Expandir el primer módulo por defecto
        if (videosData.value && videosData.value.length > 0) {
          setExpandedModules([1]);
        }
      } else {
        console.warn("Error al cargar videos:", videosData.reason);
        setVideos([]);
      }

      // Procesar inscripción
      if (enrollmentData.status === "fulfilled") {
        setEnrollment(enrollmentData.value);
        if (retrying) {
          setRetryingEnrollment(false);
          setRetryCount(0);
        }
      } else {
        // Si estamos reintentando, seguimos reintentando
        if (retrying) {
          setEnrollment({ isEnrolled: false });
        } else {
          setEnrollment({ isEnrolled: false });
        }
      }
    } catch (err) {
      console.error("Error al cargar datos del curso:", err);
      setError(err.message || "Error al cargar el curso");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    setIsClient(true);
    if (courseId) {
      loadCourseData();
    }
    // Limpiar timeout al desmontar
    return () => {
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [courseId, loadCourseData]);

  // Reintentar verificación de inscripción si no está inscrito
  useEffect(() => {
    if (
      course &&
      enrollment &&
      !enrollment.isEnrolled &&
      retryCount < MAX_RETRIES &&
      !retryingEnrollment
    ) {
      setRetryingEnrollment(true);
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        loadCourseData(true);
      }, RETRY_INTERVAL);
    }
    if (enrollment && enrollment.isEnrolled) {
      setRetryingEnrollment(false);
      setRetryCount(0);
    }
  }, [course, enrollment, retryCount, retryingEnrollment, loadCourseData]);



  const toggleModule = (moduleId) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleVideoClick = (video) => {
    setActiveVideo(video);
    setCurrentVideo(video.videoUrl);
  };

  const handleVideoComplete = async (videoId) => {
    if (!enrollment?.isEnrolled || !enrollment?.enrollmentId) {
      toast.error(
        "Debes estar inscrito en el curso para marcar videos como completados"
      );
      return;
    }

    try {
      setUpdatingProgress(true);

      // Calcular nuevo progreso basado en videos completados
      const totalVideos = videos.length;
      const completedVideos = videos.filter((v) => v.completed).length + 1; // +1 por el video actual
      const newProgress = Math.round((completedVideos / totalVideos) * 100);

      // Actualizar progreso en la API
      await updateCourseProgress(enrollment.enrollmentId, newProgress);

      // Actualizar estado local
      setVideos((prev) =>
        prev.map((v) => (v.id === videoId ? { ...v, completed: true } : v))
      );

      // Si es el último video, marcar curso como completado
      if (newProgress >= 100) {
        await markCourseAsCompleted(enrollment.enrollmentId);
        toast.success("¡Felicidades! Has completado el curso");
      } else {
        toast.success(`Progreso actualizado: ${newProgress}%`);
      }
    } catch (err) {
      console.error("Error al actualizar progreso:", err);
      toast.error("Error al actualizar el progreso");
    } finally {
      setUpdatingProgress(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const isYoutubeUrl = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const getYoutubeEmbedUrl = (url) => {
    const videoId = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Cargando contenido del curso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar el curso
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => loadCourseData()} variant="outline">
              Reintentar
            </Button>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Curso no encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            El curso que buscas no existe o no está disponible.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está inscrito
  if (!enrollment?.isEnrolled) {
    // Si estamos reintentando, mostrar mensaje de espera
    if (retryingEnrollment && retryCount < MAX_RETRIES) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Procesando acceso al curso...
            </h2>
            <p className="text-gray-600 mb-4">
              Estamos confirmando tu inscripción. Esto puede tardar unos segundos tras el pago exitoso.
            </p>
            <p className="text-gray-400 text-sm">Intento {retryCount + 1} de {MAX_RETRIES}</p>
          </div>
        </div>
      );
    }
    // Si ya se agotaron los reintentos, mostrar acceso restringido
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 mb-4">
            Debes estar inscrito en este curso para acceder al contenido.
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate(`/curso/${courseId}`)}>
              Ver Detalles del Curso
            </Button>
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calcular progreso del curso
  const completedVideos = videos.filter((v) => v.completed).length;
  const totalVideos = videos.length;
  const progressPercentage =
    totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contenido del Curso</CardTitle>
              <p className="text-sm text-gray-600">
                {totalVideos} videos • {completedVideos} completados
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {videos.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <button
                      onClick={() => toggleModule(1)}
                      className="w-full text-left p-4 flex justify-between items-center bg-gray-50">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-gray-500 mr-3" />
                        <span className="font-medium">Videos del Curso</span>
                      </div>
                      {expandedModules.includes(1) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    {expandedModules.includes(1) && (
                      <div className="pl-12 pr-4 pb-2">
                        <ul className="space-y-1">
                          {videos.map((video) => (
                            <li key={video.id} className="py-2">
                              <button
                                onClick={() => handleVideoClick(video)}
                                className={`flex items-center w-full text-left group ${
                                  activeVideo?.id === video.id
                                    ? "text-red-600 font-medium"
                                    : "text-gray-700 hover:text-red-600"
                                }`}>
                                <span className="mr-2">
                                  {video.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Play className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
                                  )}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{video.title}</div>
                                  <div className="flex items-center text-xs text-gray-500 mt-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatDuration(video.duration)}
                                    {video.isPreview && (
                                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                                        Preview
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                    <p>No hay videos disponibles</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
                <p className="text-gray-600">
                  Instructor: {course.instructor?.userName}{" "}
                  {course.instructor?.lastName}
                </p>
              </div>
              <Button
                onClick={() => navigate(`/curso/${courseId}`)}
                variant="outline"
                size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
            </div>

            {/* Barra de Progreso */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progreso del Curso
                </span>
                <span className="text-sm text-gray-600">
                  {progressPercentage}% completado
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>
                  {completedVideos} de {totalVideos} videos completados
                </span>
                {progressPercentage === 100 && (
                  <span className="flex items-center text-green-600">
                    <Award className="h-3 w-3 mr-1" />
                    ¡Curso Completado!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Video Player */}
          <Card className="mb-6 overflow-hidden">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              {currentVideo ? (
                isYoutubeUrl(currentVideo) ? (
                  <>
                    <iframe
                      src={`${getYoutubeEmbedUrl(
                        currentVideo
                      )}?modestbranding=1&rel=0&showinfo=0&controls=1&color=ef4444&iv_load_policy=3&fs=1&theme=light&color=white`}
                      title={activeVideo?.title || ""}
                      className="w-full h-full youtube-player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen></iframe>
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `
                        .youtube-player {
                          background: #f3f4f6;
                          border-radius: 0.5rem;
                          overflow: hidden;
                        }
                        .youtube-player::before {
                          content: '';
                          position: absolute;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
                          pointer-events: none;
                          border-radius: 0.5rem;
                        }
                        /* Ocultar título de YouTube */
                        .ytp-title {
                          display: none !important;
                        }
                        /* Personalizar controles */
                        .ytp-chrome-top {
                          padding-top: 0 !important;
                        }
                        /* Color de la barra de progreso */
                        .ytp-play-progress {
                          background: #ef4444 !important;
                        }
                        .ytp-scrubber-container {
                          background: #ef4444 !important;
                        }
                      `,
                      }}
                    />
                  </>
                ) : (
                  <video src={currentVideo} controls className="w-full h-full">
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Selecciona un video para comenzar
                    </p>
                    <p className="text-sm text-gray-500">
                      {videos.length > 0
                        ? `Tienes ${videos.length} videos disponibles`
                        : "No hay videos disponibles en este curso"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Información del Video Actual */}
            {activeVideo && (
              <div className="p-4 border-t">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {activeVideo.title}
                    </h3>
                    {activeVideo.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {activeVideo.description}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(activeVideo.duration)}
                      {activeVideo.isPreview && (
                        <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                          Video Preview
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón para marcar como completado */}
                  {!activeVideo.completed && (
                    <Button
                      onClick={() => handleVideoComplete(activeVideo.id)}
                      disabled={updatingProgress}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700">
                      {updatingProgress ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Marcando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar Completado
                        </>
                      )}
                    </Button>
                  )}

                  {activeVideo.completed && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Completado</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;

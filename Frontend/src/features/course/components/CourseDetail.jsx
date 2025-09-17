import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourseById } from '@/services/courseService';
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
  ListVideo
} from 'lucide-react';
import { Badge } from '@/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { enrollInCourse } from '@/services/enrollmentService';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      setError(null);
      getCourseById(courseId)
        .then(data => {
          setCourse(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al cargar el curso:", err);
          setError('No se pudo cargar el curso. Por favor, inténtalo de nuevo.');
          setLoading(false);
        });
    }
  }, [courseId]);
 
  const handleEnrollment = async () => {
    // Mejora: Usa un estado más descriptivo como `isEnrolling`
    setIsEnrolled(true);
    if (!user || user.role !== 'STUDENT') {
      toast.error("Por favor, inicie sesión como estudiante para inscribirse.");
      navigate('/authentication/login');
      setIsEnrolled(false);
      return;
    }
    try {
      await enrollInCourse(courseId);
      toast.success("¡Inscripción exitosa! Ahora puedes ver el curso en tu panel.");
      navigate('/mis-cursos');
    } catch (error) {
      let errorMessage = "Ocurrió un error inesperado al inscribirse. Por favor, inténtalo de nuevo.";
      if (error.response?.data?.message) {
        const apiMessage = error.response.data.message;
        if (apiMessage === "Ya estás inscrito en este curso. ¡Disfruta de tu aprendizaje!") {
          errorMessage = "Ya estás inscrito en este curso. ¡Disfruta de tu aprendizaje!";
        } else {
          errorMessage = apiMessage;
        }
      }
      toast.error(errorMessage);
      console.error("Error al inscribirse en el curso:", error);
    } finally {
      setIsEnrolled(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Cargando detalles del curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-700">Curso no encontrado.</p>
      </div>
    );
  }

  const totalLectures = course.sections?.reduce((sum, section) => sum + (section.lectures?.length || 0), 0);
  const isStudent = user && user.role === 'STUDENT';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna Principal - Contenido del Curso */}
        <div className="md:col-span-2">
          {/* Encabezado del Curso */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-700 leading-relaxed break-all">
              {course.subtitle || course.shortDescription}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                <span>{course.rating ? course.rating.toFixed(1) : 'Sin valoración'}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.totalStudents || 0} estudiantes</span>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 mr-3 text-gray-600" />
              <div className="text-md font-semibold text-gray-800">
                Instructor: {course.instructorid?.userName || 'N/A'} {course.instructorid?.lastName || ''}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.estimatedHours || 0} horas</span>
              </div>
              <div className="flex items-center">
                <ListVideo className="w-4 h-4 mr-1" />
                <span>{totalLectures} lecciones</span>
              </div>
            </div>
          </div>

          {/* Sección "Qué aprenderás" 
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Qué aprenderás
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
              {course.learningOutcomes?.map((outcome, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
*/}
          {/* Sección de Contenido del Curso 
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contenido del Curso
            </h2>
            <div className="space-y-4">
              {course.sections?.length > 0 ? (
                course.sections.map((section, sectionIndex) => (
                  <div key={section.id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2">
                      <BookOpen className="w-5 h-5 mr-2" />
                      {section.title}
                      <span className="ml-auto text-sm font-normal text-gray-500">
                        {section.lectures?.length || 0} lecciones
                      </span>
                    </h3>
                    <ul className="space-y-2 ml-6 border-l pl-4 border-gray-200">
                      {section.lectures?.map((lecture, lectureIndex) => (
                        <li key={lecture.id} className="text-sm text-gray-600 flex items-center">
                          <CirclePlay className="w-4 h-4 mr-2 flex-shrink-0" />
                          {lecture.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">El curso no tiene secciones de contenido aún.</p>
              )}
            </div>
          </div>
*/}
          {/* Descripción Completa
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Descripción
            </h2>
            <p className="text-gray-700 leading-relaxed break-all">
              {course.description}
            </p>
          </div>
 */}
          {/* Requisitos del Curso */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Requisitos
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {course.requirements?.length > 0 ? (
                course.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))
              ) : (
                <p className="text-gray-500">No hay requisitos específicos para este curso.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Columna Lateral - Información de Compra y General */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Imagen y Video de Previsualización */}
              <div className="relative aspect-video">
                <img
                  className="w-full h-full object-cover"
                  src={course.thumbnailUrl || '/src/assets/placeholder-course.jpg'}
                  alt={course.title}
                />
                {course.youtubeUrls && course.youtubeUrls.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Play className="w-12 h-12 text-white cursor-pointer" />
                  </div>
                )}
              </div>
              
              {/* Contenido Lateral */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Gratis'}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {course.isPremium ? 'Premium' : 'Estándar'}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Play className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Acceso de por vida</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Download className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Recursos descargables</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Acceso en móvil y TV</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Trophy className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Certificado de finalización</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  {isStudent ?(
                  
                  <button 
                  onClick={handleEnrollment}
                  disabled={isEnrolled}                  
                  className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors">
                  {isEnrolled ? 'Inscribiendo...': 'Inscribirse ahora' }
                </button>
                
               ):(
                <Link
                    to='/authentication/login'
                    className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors text-center"
                  >
                    Iniciar sesión para inscribirte
                  </Link>
                
               )}
                  
                  <Link
                    to='/'
                    className="bg-white text-gray-700 border border-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    Regresar
                  </Link>
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
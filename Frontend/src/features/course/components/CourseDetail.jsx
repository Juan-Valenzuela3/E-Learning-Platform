import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  Award, 
  Play, 
  Heart,
  Share2,
  CheckCircle,
  Globe,
  Download,
  Smartphone,
  Trophy,
  ArrowLeft,
  Calendar,
  X
} from 'lucide-react';
import ReactPlayer from 'react-player';

// Mock data - En producción esto vendría de una API
const getCourseDetail = (courseId) => {
  const courses = {
    1: {
      id: 1,
      title: 'Marketing Digital Avanzado',
      instructor: 'Diego Ruiz',
      instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      instructorBio: 'Experto en marketing digital con más de 8 años de experiencia. Ha trabajado con empresas Fortune 500.',
      rating: 4.7,
      reviewCount: 1250,
      students: 3420,
      duration: '30 horas',
      lessons: 65,
      price: 89,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center',
      category: 'MARKETING',
      level: 'Principiante',
      language: 'Español',
      lastUpdated: '2024-01-15',
      previewVideo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Domina las estrategias de marketing digital más efectivas del mercado actual. Este curso te enseñará desde los fundamentos hasta técnicas avanzadas de SEO, publicidad online, redes sociales y análisis de datos para impulsar cualquier negocio en el mundo digital.',
      whatYouLearn: [
        'Estrategias de SEO y optimización para motores de búsqueda',
        'Creación y gestión de campañas publicitarias efectivas',
        'Marketing en redes sociales y community management',
        'Email marketing y automatización de procesos',
        'Google Analytics y métricas clave de rendimiento',
        'Funnel de ventas y conversión de leads',
        'Content marketing y storytelling digital',
        'Publicidad en Google Ads y Facebook Ads'
      ],
      requirements: [
        'Conocimientos básicos de navegación en internet',
        'Interés genuino en marketing y ventas',
        'Computadora o dispositivo móvil con conexión a internet',
        'Ganas de aprender y aplicar conocimientos'
      ],
      includes: [
        '30 horas de contenido en video',
        '65 lecciones estructuradas',
        'Recursos descargables y plantillas',
        'Acceso de por vida al curso',
        'Certificado de finalización',
        'Acceso en dispositivos móviles',
        'Soporte del instructor'
      ],
      curriculum: [
        {
          title: 'Introducción al Marketing Digital',
          lessons: 8,
          duration: '2.5 horas',
          topics: [
            'Fundamentos del marketing digital',
            'Ecosistema digital actual',
            'Herramientas esenciales',
            'Definición de objetivos SMART'
          ]
        },
        {
          title: 'SEO y Optimización Web',
          lessons: 12,
          duration: '4 horas',
          topics: [
            'Investigación de palabras clave',
            'SEO on-page y off-page',
            'Google Search Console',
            'Link building estratégico'
          ]
        },
        {
          title: 'Publicidad Digital',
          lessons: 15,
          duration: '5.5 horas',
          topics: [
            'Google Ads: configuración y optimización',
            'Facebook e Instagram Ads',
            'Segmentación de audiencias',
            'Análisis de ROI publicitario'
          ]
        },
        {
          title: 'Redes Sociales y Content Marketing',
          lessons: 18,
          duration: '6 horas',
          topics: [
            'Estrategia de contenidos',
            'Community management',
            'Storytelling digital',
            'Influencer marketing'
          ]
        },
        {
          title: 'Analytics y Métricas',
          lessons: 12,
          duration: '4 horas',
          topics: [
            'Google Analytics 4',
            'KPIs y métricas clave',
            'Reportes automatizados',
            'Toma de decisiones basada en datos'
          ]
        }
      ],
      reviews: [
        {
          id: 1,
          name: 'María González',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          rating: 5,
          date: '2024-01-10',
          comment: 'Excelente curso, muy completo y práctico. Diego explica de manera muy clara y los ejemplos son súper útiles.'
        },
        {
          id: 2,
          name: 'Carlos Mendoza',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          rating: 5,
          date: '2024-01-08',
          comment: 'He aplicado las estrategias enseñadas y ya veo resultados en mi negocio. Totalmente recomendado.'
        },
        {
          id: 3,
          name: 'Ana Rodríguez',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          rating: 4,
          date: '2024-01-05',
          comment: 'Muy buen contenido, aunque me hubiera gustado más ejemplos prácticos en algunas secciones.'
        }
      ]
    }
  };
  
  return courses[courseId] || null;
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      const courseData = getCourseDetail(parseInt(courseId));
      setCourse(courseData);
      setLoading(false);
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      navigate('/login', { 
        state: { 
          from: `/curso/${courseId}/detalle`,
          message: 'Debes iniciar sesión para inscribirte al curso'
        }
      });
      return;
    }

    // Aquí iría la lógica de inscripción
    setIsEnrolled(true);
    // Redirigir al contenido del curso
    navigate(`/curso/${courseId}`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-500 fill-current' 
            : i < rating 
            ? 'text-yellow-500 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando detalles del curso...</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Curso no encontrado</h2>
          <p className="text-gray-600 mb-4">El curso que buscas no existe o ha sido eliminado.</p>
          <Button onClick={() => navigate('/cursos')}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-red-500 transition-colors"
            >
              Inicio
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate('/cursos')}
              className="hover:text-red-500 transition-colors"
            >
              Cursos
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{course.title}</span>
          </nav>
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center px-4 py-2 text-gray-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 border border-gray-300 hover:border-red-500"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              <span className="font-medium">Volver</span>
            </button>
            
            {/* Acciones rápidas */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className="mb-3" variant="secondary">
                    {course.category}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center">
                  {renderStars(course.rating)}
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {course.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({course.reviewCount.toLocaleString()} reseñas)
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  {course.students.toLocaleString()} estudiantes
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {course.lessons} lecciones
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Globe className="w-4 h-4 mr-1" />
                  {course.language}
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Instructor: {course.instructor}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {course.instructorBio}
                  </p>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Vista previa del curso</CardTitle>
                {/* Vista previa del video mejorada */}
                <div className="relative mb-6 group">
                  <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg">
                    {showPreview ? (
                      <div className="relative w-full h-full">
                        <ReactPlayer
                          url={course.previewVideo}
                          width="100%"
                          height="100%"
                          controls
                          playing
                        />
                        <button
                          onClick={() => setShowPreview(false)}
                          className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                          <button
                            onClick={() => setShowPreview(true)}
                            className="bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-6 transition-all transform hover:scale-110 shadow-xl group-hover:shadow-2xl"
                          >
                            <Play className="w-10 h-10 text-red-500 ml-1" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          Vista previa gratuita
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50">
                <nav className="flex space-x-1 px-6">
                  {[
                    { id: 'overview', label: 'Descripción', icon: BookOpen },
                    { id: 'curriculum', label: 'Temario', icon: Award },
                    { id: 'reviews', label: 'Reseñas', icon: Star }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-3 px-4 rounded-t-lg font-medium text-sm transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'bg-white text-red-500 shadow-sm border-b-2 border-red-500 -mb-px'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Lo que aprenderás */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Lo que aprenderás
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.whatYouLearn.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requisitos */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Requisitos
                      </h3>
                      <ul className="space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Contenido del curso
                      </h3>
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {course.curriculum.reduce((total, section) => total + section.lessons, 0)} lecciones totales
                      </div>
                    </div>
                    {course.curriculum.map((section, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                {index + 1}
                              </div>
                              <h4 className="font-semibold text-gray-900">
                                {section.title}
                              </h4>
                            </div>
                            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                              {section.lessons} lecciones • {section.duration}
                            </div>
                          </div>
                        </div>
                        <div className="p-5">
                          <ul className="space-y-3">
                            {section.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-center text-gray-700 hover:text-red-500 transition-colors group">
                                <div className="w-6 h-6 bg-gray-100 group-hover:bg-red-50 rounded-full flex items-center justify-center mr-3 transition-colors">
                                  <Play className="w-3 h-3 text-gray-400 group-hover:text-red-500" />
                                </div>
                                <span className="flex-1">{topic}</span>
                                <span className="text-xs text-gray-400 group-hover:text-red-500">5:30</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Reseñas de estudiantes
                      </h3>
                      <div className="flex items-center">
                        {renderStars(course.rating)}
                        <span className="ml-2 text-lg font-semibold">
                          {course.rating}
                        </span>
                        <span className="ml-2 text-gray-500">
                          ({course.reviewCount} reseñas)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {course.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {review.name}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.date).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6">
                <div className="aspect-video bg-gray-100 rounded-lg mb-6 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ${course.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${course.originalPrice}
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% descuento
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    onClick={handleEnroll}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group"
                  >
                    {isEnrolled ? (
                      <>
                        <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                        Continuar curso
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                        {isAuthenticated ? 'Inscribirse ahora' : 'Iniciar sesión para inscribirse'}
                      </>
                    )}
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorito
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <h4 className="font-semibold text-gray-900">Este curso incluye:</h4>
                  {course.includes.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Última actualización: {new Date(course.lastUpdated).toLocaleDateString('es-ES')}
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Smartphone className="w-4 h-4 mr-1" />
                      Móvil
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      Descargable
                    </div>
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      Certificado
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
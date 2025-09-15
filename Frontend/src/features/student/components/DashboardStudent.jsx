'use client';

import React, { lazy, Suspense, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { Skeleton } from "@/ui/skeleton";
import { Search, BookOpen, Star, Star as StarFilled, Clock, Bell, ChevronRight } from "lucide-react";
import { useDashboard } from "@/shared/hooks/useDashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from 'react-router-dom';
import { getRecommendedCourses, getEnrolledCourses } from '@/features/course/services';
import { useAuth } from "@/contexts/ContextUse";

// Lazy load components for better performance
const DashboardStats = lazy(() => import('./DashboardStats'));
const CourseList = lazy(() => import('./CourseList'));
const ActivityFeed = lazy(() => import('./ActivityFeed'));
const UpcomingEvents = lazy(() => import('./UpcomingEvents'));

export default function DashboardStudent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [recError, setRecError] = useState('');

  // New: enrolled courses for "Continuar aprendiendo"
  const [enrolled, setEnrolled] = useState([]);
  const [enrLoading, setEnrLoading] = useState(true);
  const [enrError, setEnrError] = useState('');

  const {
    stats,
    filteredCourses,
    recentActivities,
    upcomingEvents,
    loading,
    handleToggleFavorite,
    handleMarkAsRead,
    handleJoinEvent
  } = useDashboard(searchQuery, activeTab);

  const formattedDate = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });

  useEffect(() => {
    let active = true;
    const loadRecs = async () => {
      try {
        setRecLoading(true);
        const data = await getRecommendedCourses();
        if (active) setRecommended(data);
      } catch (e) {
        if (active) setRecError('No se pudieron cargar las recomendaciones.');
      } finally {
        if (active) setRecLoading(false);
      }
    };
    const loadEnrolled = async () => {
      try {
        setEnrLoading(true);
        const data = await getEnrolledCourses();
        if (active) setEnrolled(data);
      } catch (e) {
        if (active) setEnrError('No se pudieron cargar tus cursos.');
      } finally {
        if (active) setEnrLoading(false);
      }
    };
    loadRecs();
    loadEnrolled();
    return () => { active = false; };
  }, []);

  // mostras el nombre del usuario autenticado 
  const {user}= useAuth();

  //console.log('Usuario actual QUE SE ESTA MOSTRANDO EN EL DASHBOARD:', user);

  // Local: toggle favorite for enrolled courses
  const handleToggleFavoriteEnrolled = (courseId) => {
    setEnrolled(prev => prev.map(c => c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  // Local: filter enrolled by activeTab
  const filteredEnrolled = React.useMemo(() => {
    const base = enrolled;
    switch (activeTab) {
      case 'in-progress':
        return base.filter(c => (c.progress ?? 0) < 100);
      case 'completed':
        return base.filter(c => (c.progress ?? 0) === 100);
      case 'favorites':
        return base.filter(c => !!c.isFavorite);
      default:
        return base;
    }
  }, [enrolled, activeTab]);

  // Loading skeleton
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header redesigned */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bienvenido {user?.name} {user?.lastName} <span className="text-red-500">👋</span></h1>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button asChild variant="outline">
            <Link to="/mis-cursos">Mis cursos</Link>
          </Button>
          <Button asChild>
            <Link to="/cursos">Explorar</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/perfil">Perfil</Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" disabled={loading}>
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats stats={stats} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continuar aprendiendo */}
          <Card>
            <CardHeader className="pb-3 flex items-center justify-between">
              <CardTitle>Continuar aprendiendo</CardTitle>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full sm:w-auto"
                disabled={loading}
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="in-progress">En Curso</TabsTrigger>
                  <TabsTrigger value="completed">Completados</TabsTrigger>
                  <TabsTrigger value="favorites">Favoritos</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button asChild variant="link" className="text-red-500">
                <Link to="/mis-cursos" className="flex items-center">Ver todo <ChevronRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              {enrLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-20 w-full bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 w-full bg-gray-100 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : enrError ? (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">{enrError}</div>
              ) : filteredEnrolled.length === 0 ? (
                <div className="text-gray-600">Aún no tienes cursos. Empieza explorando el catálogo.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr">
                  {filteredEnrolled.slice(0, 4).map((course) => (
                    <Card
                      key={course.id}
                      className="border overflow-hidden h-full transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-medium text-gray-900 line-clamp-1 break-words">{course.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-1">Por {course.instructor}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => { e.stopPropagation?.(); handleToggleFavoriteEnrolled(course.id); }}
                                title={course.isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                              >
                                {course.isFavorite ? (
                                  <StarFilled className="h-4 w-4 text-yellow-500 fill-current" />
                                ) : (
                                  <Star className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge variant="secondary">Inscrito</Badge>
                              {course.progress === 100 ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">Completado</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 border-red-200">En curso</Badge>
                              )}
                              {typeof course.rating === 'number' && (
                                <span className="text-xs text-yellow-700 flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current" /> {course.rating}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>Progreso</span>
                                <span className="font-medium">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            <div className="mt-3 flex gap-2 flex-wrap">
                              <Button asChild size="sm" variant="outline" className="whitespace-nowrap">
                                <Link to={`/curso/${course.id}`}>{course.progress === 100 ? 'Ver de nuevo' : 'Continuar'}</Link>
                              </Button>
                              <Button asChild size="sm" className="whitespace-nowrap">
                                <Link to={`/curso/${course.id}`}>Detalles</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cursos Recomendados */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Cursos Recomendados</CardTitle>

              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CourseList
                courses={filteredCourses}

              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ActivitiesSkeleton />}>
                <ActivityFeed
                  activities={recentActivities}
                  onMarkAsRead={handleMarkAsRead}
                />
              </Suspense>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<EventsSkeleton />}>
                <UpcomingEvents
                  events={upcomingEvents}
                  onJoinEvent={handleJoinEvent}
                />
              </Suspense>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
}

// Skeleton Components
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <div className="h-9 bg-gray-200 rounded-md w-full"></div>
          </div>
          <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-32 bg-white rounded-lg p-4 shadow-sm border">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-2 w-full bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Courses Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-20 w-20 bg-gray-200 rounded-md"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                      <div className="h-2 w-full bg-gray-100 rounded"></div>
                      <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Activities Skeleton */}
          <div className="bg-white rounded-lg border p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Skeleton */}
          <div className="bg-white rounded-lg border p-6">
            <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-start space-x-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-md flex-shrink-0"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual skeleton components (can be used as fallbacks for Suspense)
function StatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="h-32 bg-white rounded-lg p-4 shadow-sm border animate-pulse">
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded mb-2"></div>
          <div className="h-2 w-full bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function CoursesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="border rounded-lg p-4 animate-pulse">
          <div className="flex items-start space-x-4">
            <div className="h-20 w-20 bg-gray-200 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-2 w-full bg-gray-100 rounded"></div>
              <div className="h-2 w-5/6 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivitiesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex items-start space-x-3 animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((item) => (
        <div key={item} className="flex items-start space-x-3 animate-pulse">
          <div className="h-12 w-12 bg-gray-200 rounded-md flex-shrink-0"></div>
          <div className="flex-1 space-y-1">
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

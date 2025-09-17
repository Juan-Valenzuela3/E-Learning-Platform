// src/DashboardStudent.jsx

"use client";

import React, { lazy, Suspense,  useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Input } from "@/ui/Input";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import { Skeleton } from "@/ui/skeleton";
import {
  Search,
  BookOpen,
  Star,
  Clock,
  Bell,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useDashboard } from "@/shared/hooks/useDashboard";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Componentes con lazy load
const DashboardStats = lazy(() => import("./DashboardStats"));
const ActivityFeed = lazy(() => import("./ActivityFeed"));
const CourseList = lazy(() => import("./CourseList"));
const UpcomingEvents = lazy(() => import("./UpcomingEvents"));
const CursosSugeridos = lazy(() => import("@/features/marketing/components/CursosSugeridos")); // Asegúrate de que la ruta sea correcta

// Componentes de esqueleto (Skeletons)
function CourseListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="flex flex-col animate-pulse">
          <div className="w-full h-32 bg-gray-200 rounded-t-lg" />
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="h-2 bg-gray-200 rounded w-full mb-2" />
            <div className="h-2 bg-gray-200 rounded w-5/6" />
          </CardContent>
          <div className="p-4 border-t border-gray-200">
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        </Card>
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
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4 animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-md" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-100 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardStudent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const {
     isLoading,
    error,
    suggestedCourses,
    showSuggested,
    filteredCourses,
    stats,
    recentActivities,
    upcomingEvents,
  } = useDashboard();



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }


  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 lg:p-8">
      <div className="flex-1 space-y-6">
         <div className="pb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenido, {user?.userName || "Usuario"}! {/* ✅ Uso de optional chaining */}
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            {format(new Date(), 'EEEE, d MMMM', { locale: es })}
          </p>
        </div>

        <Suspense fallback={<CourseListSkeleton />}>
        <DashboardStats stats={stats} />
        </Suspense>
         <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* ✅ Sección de Cursos Unificada: Mis Cursos o Cursos Sugeridos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">
              {showSuggested ? "Cursos Sugeridos" : "Mis Cursos"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Suspense fallback={<CourseListSkeleton />}>
                <CourseListSkeleton />
              </Suspense>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <AlertCircle className="w-10 h-10 mx-auto mb-2" />
                <p>{error}</p>
              </div>
            ) : showSuggested ? (
              <Suspense fallback={<CourseListSkeleton />}>
                <CursosSugeridos courses={suggestedCourses} />
              </Suspense>
            ) : filteredCourses && filteredCourses.length > 0 ? (
              <Suspense fallback={<CourseListSkeleton />}>
                <CourseList courses={filteredCourses} />
              </Suspense>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <BookOpen className="w-10 h-10 mx-auto mb-2" />
                <p>
                  {searchTerm
                    ? "No se encontraron cursos que coincidan con tu búsqueda."
                    : "Aún no estás inscrito en ningún curso."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6 lg:min-w-[300px] lg:max-w-[400px]">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ActivitiesSkeleton />}>
              <ActivityFeed activities={recentActivities} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Próximos Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<EventsSkeleton />}>
              <UpcomingEvents events={upcomingEvents} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

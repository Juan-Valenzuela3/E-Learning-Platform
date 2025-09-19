import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { Progress } from "@/ui/progress";
import { Badge } from "@/ui/badge";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function ProgressOverview({ enrollments = [] }) {
  // Debug: Ver qué datos están llegando
  console.log("ProgressOverview - enrollments:", enrollments);

  // Calcular estadísticas de progreso
  const totalCourses = enrollments.length;
  const activeCourses = enrollments.filter((e) => e.status === "ACTIVE").length;
  const completedCourses = enrollments.filter(
    (e) => e.status === "COMPLETED"
  ).length;

  // Calcular progreso promedio
  const averageProgress =
    totalCourses > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + (e.progressPercentage || 0), 0) /
            totalCourses
        )
      : 0;

  // Debug: Ver cálculos
  console.log("ProgressOverview - totalCourses:", totalCourses);
  console.log("ProgressOverview - activeCourses:", activeCourses);
  console.log("ProgressOverview - completedCourses:", completedCourses);
  console.log("ProgressOverview - averageProgress:", averageProgress);

  // Calcular horas totales estimadas
  const totalEstimatedHours = enrollments.reduce((sum, e) => {
    const course = e.course;
    return sum + (course?.estimatedHours || 0);
  }, 0);

  // Calcular horas completadas
  const completedHours = enrollments.reduce((sum, e) => {
    const course = e.course;
    const estimatedHours = course?.estimatedHours || 0;
    const progressRatio = (e.progressPercentage || 0) / 100;
    return sum + estimatedHours * progressRatio;
  }, 0);

  // Cursos con mejor progreso
  const topProgressCourses = enrollments
    .filter((e) => e.status === "ACTIVE" && e.progressPercentage > 0)
    .sort((a, b) => (b.progressPercentage || 0) - (a.progressPercentage || 0))
    .slice(0, 3);

  // Cursos recientes
  const recentCourses = enrollments
    .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
    .slice(0, 3);

  if (totalCourses === 0) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Tu Progreso de Aprendizaje
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <BookOpen className="mx-auto h-12 w-12 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            ¡Comienza tu viaje de aprendizaje!
          </h3>
          <p className="text-blue-600 mb-4">
            Inscríbete en tu primer curso para ver tu progreso aquí.
          </p>
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-300">
            Explora cursos disponibles
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="h-5 w-5" />
            Tu Progreso de Aprendizaje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-800">
                {totalCourses}
              </div>
              <div className="text-sm text-blue-600">Cursos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {completedCourses}
              </div>
              <div className="text-sm text-green-600">Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {activeCourses}
              </div>
              <div className="text-sm text-orange-600">En Progreso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {averageProgress}%
              </div>
              <div className="text-sm text-purple-600">Progreso Promedio</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700">Progreso General</span>
              <span className="font-medium text-blue-800">
                {averageProgress}%
              </span>
            </div>
            <Progress value={averageProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Cursos con Mejor Progreso */}
      {topProgressCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Cursos con Mejor Progreso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProgressCourses.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;

              return (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {course.instructor?.userName || "Instructor"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {enrollment.progressPercentage || 0}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(
                          ((course.estimatedHours || 0) *
                            (enrollment.progressPercentage || 0)) /
                            100
                        )}
                        h completadas
                      </div>
                    </div>
                    <Progress
                      value={enrollment.progressPercentage || 0}
                      className="w-16 h-2"
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Cursos Recientes */}
      {recentCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Cursos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCourses.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;

              const enrollmentDate = new Date(enrollment.enrollmentDate);
              const daysAgo = Math.floor(
                (Date.now() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={enrollment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Inscrito hace{" "}
                      {daysAgo === 0
                        ? "hoy"
                        : `${daysAgo} día${daysAgo > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        enrollment.status === "COMPLETED"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        enrollment.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }>
                      {enrollment.status === "COMPLETED"
                        ? "Completado"
                        : "En Progreso"}
                    </Badge>
                    {enrollment.status === "ACTIVE" && (
                      <div className="text-sm text-gray-500">
                        {enrollment.progressPercentage || 0}%
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Resumen de Horas */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Clock className="h-5 w-5" />
            Tiempo de Estudio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800">
                {Math.round(completedHours)}h
              </div>
              <div className="text-sm text-green-600">Horas Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {Math.round(totalEstimatedHours)}h
              </div>
              <div className="text-sm text-emerald-600">
                Horas Totales Estimadas
              </div>
            </div>
          </div>

          {totalEstimatedHours > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Progreso de Horas</span>
                <span className="font-medium text-green-800">
                  {Math.round((completedHours / totalEstimatedHours) * 100)}%
                </span>
              </div>
              <Progress
                value={(completedHours / totalEstimatedHours) * 100}
                className="h-3"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

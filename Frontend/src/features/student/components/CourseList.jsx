import React, { useState } from "react";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import {
  Play,
  Star,
  Star as StarFilled,
  ShoppingCart,
  X,
  MoreVertical,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/ui/badge";
import { useNavigate } from "react-router-dom";
import { createStripeCheckoutSession } from "@/services/paymentService";
import { unenrollFromCourse } from "@/services/enrollmentService";
import { useAuth } from "@/contexts/useAuth";
import { toast } from "sonner";
import {
  generateCoursePlaceholder,
  handleImageError,
} from "@/utils/imageUtils";

export default function CourseList({
  courses,
  onToggleFavorite,
  onUnenroll,
  refreshData,
}) {
  const navigate = useNavigate();
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [unenrollingCourse, setUnenrollingCourse] = useState(null);
  const [showUnenrollConfirm, setShowUnenrollConfirm] = useState(false);
  const { user } = useAuth();

  // Debug: Ver qué datos están llegando
  console.log("CourseList - courses data:", courses);
  courses.forEach((course, index) => {
    console.log(`CourseList - Course ${index}:`, {
      id: course.id,
      title: course.title,
      progress: course.progress,
      progressType: typeof course.progress,
      isEnrolled: course.progress !== undefined && course.progress !== null,
    });
  });

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleContinueCourse = (course) => {
    navigate(`/curso/${course.id}`, {
      state: {
        lastAccessed: course.lastAccessed,
        progress: course.progress,
        lastLessonId: course.lastLessonId,
      },
    });
  };

  const formatPrice = (course) => {
    const price = typeof course.price === "number" ? course.price : 0;
    return price.toLocaleString("es-PE", {
      style: "currency",
      currency: "USD",
    });
  };

  const getButtonText = (progress) => {
    if (progress === undefined || progress === null) {
      return "Comprar";
    }
    if (progress === 0) {
      return "Empezar curso";
    }
    if (progress === 100) {
      return "Ver de nuevo";
    }
    return "Continuar curso";
  };

  const getButtonVariant = (progress) => {
    if (progress === 100) {
      return "outline";
    }
    return "default";
  };

  const handlePurchase = async () => {
    if (!paymentCourse) return;

    setProcessing(true);
    setPaymentError("");

    try {
      const data = await createStripeCheckoutSession(
        paymentCourse.id,
        user.id, // Obtener del contexto de autenticación
        `${window.location.origin}/payment/success`,
        `${window.location.origin}/payment/cancel`
      );

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Error en el pago:", error);
      setPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleUnenrollClick = (course) => {
    setUnenrollingCourse(course);
    setShowUnenrollConfirm(true);
  };

  const handleConfirmUnenroll = async () => {
    if (!unenrollingCourse) return;

    try {
      // Buscar el enrollmentId del curso
      const enrollment = courses.find(
        (course) => course.id === unenrollingCourse.id
      );
      if (!enrollment || !enrollment.enrollmentId) {
        throw new Error("No se encontró la información de inscripción");
      }

      await unenrollFromCourse(enrollment.enrollmentId);

      // Recargar los datos del dashboard
      if (refreshData) {
        await refreshData();
      }

      // Notificar al componente padre para actualizar la lista
      if (onUnenroll) {
        await onUnenroll(unenrollingCourse.id);
      }

      setShowUnenrollConfirm(false);
      setUnenrollingCourse(null);
      toast.success("Te has desinscrito del curso correctamente");
    } catch (error) {
      console.error("Error al desinscribirse:", error);
      toast.error(error.message || "Error al desinscribirse del curso");
    }
  };

  const handleCancelUnenroll = () => {
    setShowUnenrollConfirm(false);
    setUnenrollingCourse(null);
  };

  // Si no hay cursos, mostrar mensaje
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No tienes cursos inscritos
        </h3>
        <p className="text-gray-500 mb-4">
          Explora nuestros cursos disponibles y comienza tu viaje de
          aprendizaje.
        </p>
        <Button
          onClick={() => {
            /* Navegar a catálogo */
          }}
          className="bg-blue-600 hover:bg-blue-700">
          Explorar Cursos
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative">
            <img
              src={
                course.imageUrl ||
                generateCoursePlaceholder(course.title || "Curso")
              }
              alt={course.title || "Curso"}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => handleImageError(e, "Sin imagen")}
            />
            {course.isFavorite && (
              <StarFilled
                className="absolute top-3 right-3 h-6 w-6 text-yellow-400 fill-yellow-400 cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => onToggleFavorite(course.id)}
              />
            )}
            <Badge
              variant="outline"
              className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm">
              {course.category || "Sin categoría"}
            </Badge>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2">
              {course.title || "Curso sin título"}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2">
              {course.description ||
                course.shortDescription ||
                "Sin descripción disponible"}
            </p>
            {course.progress !== undefined ? (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress
                  value={course.progress}
                  className="h-2"
                  indicatorColor={getProgressColor(course.progress)}
                />
              </div>
            ) : (
              <div className="flex justify-between items-center text-sm font-medium pt-2">
                <span className="text-gray-900">{formatPrice(course)}</span>
              </div>
            )}

            <div className="flex gap-2">
              {course.progress !== undefined && course.progress !== null ? (
                <>
                  <Button
                    variant={getButtonVariant(course.progress)}
                    onClick={() => handleContinueCourse(course)}
                    className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    {getButtonText(course.progress)}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleUnenrollClick(course)}
                    className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setPaymentCourse(course)}
                  className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Comprar
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* ✅ Implementación del modal de diálogo simple */}
      {paymentCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Confirmar Compra</h2>
              <p className="text-sm text-gray-500">
                Estás a punto de comprar el curso de **{paymentCourse.title}**.
                Serás redirigido a la página de pago segura de Stripe para
                completar la transacción.
              </p>
              {paymentError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
                  {paymentError}
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setPaymentCourse(null)}
                  disabled={processing}>
                  Cancelar
                </Button>
                <Button onClick={handlePurchase} disabled={processing}>
                  {processing ? "Redirigiendo…" : "Proceder al pago"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para desinscripción */}
      {showUnenrollConfirm && unenrollingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <X className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Desinscribirse del curso
                </h2>
              </div>

              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres desinscribirte del curso{" "}
                <span className="font-semibold text-gray-900">
                  "{unenrollingCourse.title || "este curso"}"
                </span>
                ?
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Advertencia:</strong> Perderás todo tu progreso en
                  este curso y tendrás que volver a inscribirte para acceder al
                  contenido.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelUnenroll}
                  className="text-gray-600 hover:text-gray-700">
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmUnenroll}
                  className="bg-red-600 hover:bg-red-700 text-white">
                  <X className="mr-2 h-4 w-4" />
                  Desinscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

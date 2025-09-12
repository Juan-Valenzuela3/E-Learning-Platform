import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { Play, Star, Star as StarFilled } from "lucide-react";
import { Badge } from "@/ui/badge";
import { useNavigate } from "react-router-dom";
import React, { useMemo, useState } from 'react';

export default function CourseList({ courses, onToggleFavorite }) {
  const navigate = useNavigate();
  const [previewCourse, setPreviewCourse] = useState(null);
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleContinueCourse = (course) => {
    // Navigate to the course page, which will handle the redirection to the appropriate lesson
    // The course page can use the course's progress to determine which lesson to show
    navigate(`/curso/${course.id}`, {
      state: {
        lastAccessed: course.lastAccessed,
        progress: course.progress,
        lastLessonId: course.lastLessonId // Assuming this is available in your course data
      }
    });
  };

  const formatPrice = (course) => {
    const price = typeof course.price === 'number' ? course.price : 0;
    return price.toLocaleString('es-PE', { style: 'currency', currency: 'USD' });
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!paymentCourse) return;
    setPaymentError('');
    setProcessing(true);
    try {
      // Simular procesamiento
      await new Promise((res) => setTimeout(res, 900));
      // En un futuro: llamada al backend -> crear orden -> confirmar -> matricular
      const courseId = paymentCourse.id;
      setPaymentCourse(null);
      navigate(`/curso/${courseId}`);
    } catch (err) {
      setPaymentError('No se pudo procesar el pago. Inténtalo nuevamente.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div
          key={course.id}
          className="group flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-lg border hover:shadow-md transition-shadow"
        >
          <div className="w-full sm:w-24 h-16 rounded-md overflow-hidden mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
            <img
              src={course.image}
              alt={course.name}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => handleContinueCourse(course)}
            />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="cursor-pointer" onClick={() => handleContinueCourse(course)}>
                <h3 className="font-medium text-gray-900 hover:text-blue-600 flex items-center gap-2">
                  {course.name}
                  {course.isEnrolled && <Badge className="text-[10px]" variant="secondary">Inscrito</Badge>}
                </h3>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {course.completedLessons}/{course.totalLessons} lecciones
                  </span>
                  <span className="text-xs text-gray-700 ml-2">{formatPrice(course)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(course.id);
                  }}
                >
                  {course.isFavorite ? (
                    <StarFilled className="h-4 w-4 text-yellow-500 fill-current" />
                  ) : (
                    <Star className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewCourse(course);
                  }}
                >
                  Ver contenido
                </Button>
                {course.isEnrolled ? (
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContinueCourse(course);
                    }}
                  >
                    <Play className="h-4 w-4" />
                    {course.progress === 0 ? 'Comenzar' : 'Continuar'}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPaymentCourse(course);
                    }}
                  >
                    Inscribirse
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-3">
              {course.isEnrolled ? (
                <>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progreso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Último acceso: {course.lastAccessed.toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </>
              ) : (
                <div className="text-xs text-gray-600">No inscrito</div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Preview Modal */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewCourse(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-lg p-4 md:p-6 mx-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewCourse.name}</h3>
                <p className="text-sm text-gray-600">Categoría: {previewCourse.category}</p>
              </div>
              <Button variant="ghost" onClick={() => setPreviewCourse(null)}>Cerrar</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <img src={previewCourse.image} alt={previewCourse.name} className="w-full h-40 md:h-56 object-cover rounded" />
              <div className="space-y-2">
                <p className="text-sm text-gray-700">Lecciones: {previewCourse.totalLessons}</p>
                <p className="text-sm text-gray-700">Precio: {formatPrice(previewCourse)}</p>
                {previewCourse.isEnrolled ? (
                  <p className="text-sm text-green-700">Ya estás inscrito en este curso.</p>
                ) : (
                  <p className="text-sm text-gray-700">Aún no estás inscrito.</p>
                )}
                <div className="pt-2 flex gap-2">
                  <Button onClick={() => { setPreviewCourse(null); navigate(`/curso/${previewCourse.id}`); }}>
                    {previewCourse.isEnrolled ? 'Ir al curso' : 'Ver detalles'}
                  </Button>
                  {!previewCourse.isEnrolled && (
                    <Button variant="outline" onClick={() => { setPreviewCourse(null); setPaymentCourse(previewCourse); }}>Inscribirse</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => !processing && setPaymentCourse(null)} />
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-4 md:p-6 mx-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Inscribirse a {paymentCourse.name}</h3>
                <p className="text-sm text-gray-600">Total a pagar: {formatPrice(paymentCourse)}</p>
              </div>
              <Button variant="ghost" onClick={() => !processing && setPaymentCourse(null)} disabled={processing}>Cerrar</Button>
            </div>
            <form className="space-y-3" onSubmit={handleConfirmPayment}>
              <div>
                <label className="text-xs text-gray-600">Titular de la tarjeta</label>
                <input required className="mt-1 w-full border rounded px-3 py-2 text-sm" placeholder="Nombre Apellido" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Número de tarjeta</label>
                <input required inputMode="numeric" pattern="[0-9\s]{12,19}" className="mt-1 w-full border rounded px-3 py-2 text-sm" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-600">Expiración</label>
                  <input required pattern="(0[1-9]|1[0-2])\/[0-9]{2}" className="mt-1 w-full border rounded px-3 py-2 text-sm" placeholder="MM/AA" />
                </div>
                <div className="w-24">
                  <label className="text-xs text-gray-600">CVC</label>
                  <input required pattern="[0-9]{3,4}" className="mt-1 w-full border rounded px-3 py-2 text-sm" placeholder="123" />
                </div>
              </div>
              {paymentError && <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">{paymentError}</div>}
              <div className="pt-2 flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setPaymentCourse(null)} disabled={processing}>Cancelar</Button>
                <Button type="submit" disabled={processing}>{processing ? 'Procesando…' : 'Confirmar pago'}</Button>
              </div>
            </form>
            <p className="mt-3 text-[11px] text-gray-500">Simulación de pago para desarrollo. Integra una pasarela real (Stripe, Mercado Pago, PayPal) en producción.</p>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/progress";
import { Play, Star, Star as StarFilled, ShoppingCart } from "lucide-react";
import { Badge } from "@/ui/badge";
import { useNavigate } from "react-router-dom";
import { createStripeCheckoutSession} from '@/services/paymentService'
import { useAuth } from '@/shared/hooks/useAuth';

export default function CourseList({ courses, onToggleFavorite }) {
  const navigate = useNavigate();
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const {user} = useAuth();


  const getProgressColor = (progress) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleContinueCourse = (course) => {
    navigate(`/curso/${course.id}`, {
      state: {
        lastAccessed: course.lastAccessed,
        progress: course.progress,
        lastLessonId: course.lastLessonId
      }
    });
  };

  const formatPrice = (course) => {
    const price = typeof course.price === 'number' ? course.price : 0;
    return price.toLocaleString('es-PE', { style: 'currency', currency: 'USD' });
  };

  const getButtonText = (progress) => {
    if (progress === undefined) {
      return "Comprar";
    }
    if (progress === 0) {
      return "Empezar curso";
    }
    if (progress === 100) {
      return "Ver de nuevo";
    }
    return "Continuar";
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
    setPaymentError('');

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
      console.error('Error en el pago:', error);
      setPaymentError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course.id} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative">
            <img
              src={course.imageUrl || `https://via.placeholder.com/400x250.png?text=${encodeURIComponent(course.title)}`}
              alt={course.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {course.isFavorite && (
              <StarFilled
                className="absolute top-3 right-3 h-6 w-6 text-yellow-400 fill-yellow-400 cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => onToggleFavorite(course.id)}
              />
            )}
            <Badge
              variant="outline"
              className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm"
            >
              {course.category}
            </Badge>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2">{course.description}</p>
            {course.progress !== undefined ? (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" indicatorColor={getProgressColor(course.progress)} />
              </div>
            ) : (
              <div className="flex justify-between items-center text-sm font-medium pt-2">
                <span className="text-gray-900">{formatPrice(course)}</span>
              </div>
            )}

            <div className="flex gap-2">
              {course.progress !== undefined ? (
                <Button
                  variant={getButtonVariant(course.progress)}
                  onClick={() => handleContinueCourse(course)}
                  className="w-full"
                >
                  {getButtonText(course.progress)}
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => setPaymentCourse(course)}
                  className="w-full"
                >
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
                Serás redirigido a la página de pago segura de Stripe para completar la transacción.
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
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handlePurchase}
                  disabled={processing}
                >
                  {processing ? 'Redirigiendo…' : 'Proceder al pago'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
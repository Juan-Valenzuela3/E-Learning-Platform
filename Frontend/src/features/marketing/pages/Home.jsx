// src/features/marketing/pages/Home.jsx

import React, { Suspense, lazy, useEffect, useState, useRef } from "react";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

// ⚠️ Importa tu servicio de API para obtener los datos
import { getCourses } from "@/services/courseService";

// Componentes críticos (carga inmediata)
import HeroSection from "@/features/marketing/components/HeroSection";

// Componentes no críticos (carga diferida)
const Price = lazy(() => import("@/features/marketing/components/Price"));
const InstructoresCard = lazy(() =>
  import("@/features/marketing/components/InstructoresCard")
);
const TestimonioCard = lazy(() =>
  import("@/features/marketing/components/testimonioCard")
);
const CtaButton = lazy(() =>
  import("@/features/marketing/components/CTAButton")
);
const CursosSugeridos = lazy(() =>
  import("@/features/marketing/pages/CatalogoCursos")
);
const FallbackCourses = lazy(() =>
  import("@/features/marketing/components/FallbackCourses")
);

const LoadingPlaceholder = ({ height = "h-96" }) => (
  <div
    className={`${height} w-full flex items-center justify-center bg-gray-50 rounded-lg`}>
    <LoadingSpinner />
  </div>
);

const LazyLoadWrapper = ({ children, placeholderHeight }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (isVisible || !ref.current) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );
    observer.observe(ref.current);
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isVisible]);

  return (
    <div ref={ref}>
      <Suspense fallback={<LoadingPlaceholder height={placeholderHeight} />}>
        {isVisible ? (
          children
        ) : (
          <LoadingPlaceholder height={placeholderHeight} />
        )}
      </Suspense>
    </div>
  );
};

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Agregar timeout para evitar carga infinita
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout: La solicitud tardó demasiado")),
            10000
          )
        );

        const dataPromise = getCourses();
        const data = await Promise.race([dataPromise, timeoutPromise]);

        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setError("El formato de datos de la API es incorrecto.");
        }
      } catch (err) {
        console.error("Error al cargar cursos:", err);
        if (err.message.includes("Timeout")) {
          setError(
            "El servidor tardó demasiado en responder. Por favor, recarga la página."
          );
        } else if (err.message.includes("500")) {
          setError("Error interno del servidor. Por favor, intenta más tarde.");
        } else {
          setError("Error al cargar los cursos. Por favor, recarga la página.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="home-container space-y-16 md:space-y-24">
        <HeroSection />
        <div className="text-center py-8">
          <LoadingSpinner />
          <p className="mt-2 text-gray-500">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container space-y-16 md:space-y-24">
        <HeroSection />

        {/* Aviso de error */}
        <div className="text-center py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
            <div className="text-yellow-600 mb-2">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-sm font-medium">Mostrando cursos de ejemplo</p>
            </div>
            <p className="text-yellow-700 text-sm mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
              Reintentar
            </button>
          </div>
        </div>

        {/* Cursos de fallback */}
        <LazyLoadWrapper placeholderHeight="h-80">
          <Suspense fallback={<LoadingPlaceholder height="h-80" />}>
            <FallbackCourses />
          </Suspense>
        </LazyLoadWrapper>

        <LazyLoadWrapper placeholderHeight="h-80">
          <Suspense fallback={<LoadingPlaceholder height="h-80" />}>
            <Price />
          </Suspense>
        </LazyLoadWrapper>

        <LazyLoadWrapper placeholderHeight="h-96">
          <Suspense fallback={<LoadingPlaceholder height="h-96" />}>
            <InstructoresCard />
          </Suspense>
        </LazyLoadWrapper>

        <LazyLoadWrapper placeholderHeight="h-96">
          <Suspense fallback={<LoadingPlaceholder height="h-96" />}>
            <TestimonioCard />
          </Suspense>
        </LazyLoadWrapper>
      </div>
    );
  }

  return (
    <div className="home-container space-y-16 md:space-y-24">
      <HeroSection />

      {/* ✅ Pasamos la prop 'courses' al componente CursosSugeridos */}
      <LazyLoadWrapper placeholderHeight="h-80">
        <CursosSugeridos courses={courses} />
      </LazyLoadWrapper>

      <LazyLoadWrapper placeholderHeight="h-80">
        <Price />
      </LazyLoadWrapper>

      <LazyLoadWrapper placeholderHeight="h-96">
        <InstructoresCard />
      </LazyLoadWrapper>

      <LazyLoadWrapper placeholderHeight="h-96">
        <TestimonioCard />
      </LazyLoadWrapper>

      <LazyLoadWrapper placeholderHeight="h-64">
        <CtaButton />
      </LazyLoadWrapper>
    </div>
  );
}

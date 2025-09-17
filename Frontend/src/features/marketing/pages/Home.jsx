// src/features/marketing/pages/Home.jsx

import React, { Suspense, lazy, useEffect, useState, useRef } from 'react';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

// ⚠️ Importa tu servicio de API para obtener los datos
import { getCourses } from "@/services/courseService";

// Componentes críticos (carga inmediata)
import HeroSection from "@/features/marketing/components/HeroSection";

// Componentes no críticos (carga diferida)
const Price = lazy(() => import("@/features/marketing/components/Price"));
const InstructoresCard = lazy(() => import("@/features/marketing/components/InstructoresCard"));
const TestimonioCard = lazy(() => import("@/features/marketing/components/testimonioCard"));
const CtaButton = lazy(() => import("@/features/marketing/components/CTAButton"));
const CursosSugeridos = lazy(() => import("@/features/marketing/pages/CatalogoCursos"));

const LoadingPlaceholder = ({ height = 'h-96' }) => (
  <div className={`${height} w-full flex items-center justify-center bg-gray-50 rounded-lg`}>
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
        rootMargin: '100px',
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
        {isVisible ? children : <LoadingPlaceholder height={placeholderHeight} />}
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
        const data = await getCourses();
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setError("El formato de datos de la API es incorrecto.");
        }
      } catch (err) {
        setError("Error al cargar los cursos.");
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
          <div className="text-center py-8 text-red-500">
              <p>{error}</p>
          </div>
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
import React, { Suspense, lazy, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Componentes críticos (carga inmediata)
import HeroSection from "@/features/marketing/components/HeroSection";

// Componentes no críticos (carga diferida)
const CursoDisponible = lazy(() => import("@/features/marketing/components/CursoCard"));
const Price = lazy(() => import("@/features/marketing/components/Price"));
const InstuctoresCard = lazy(() => import("@/features/marketing/components/InstructoresCard"));
const TestimonioCard = lazy(() => import("@/features/marketing/components/testimonioCard"));
const CtaButton = lazy(() => import("@/features/marketing/components/CTAButton"));

// Componente de carga personalizado
const LoadingPlaceholder = ({ height = 'h-96' }) => (
  <div className={`${height} w-full flex items-center justify-center`}>
    <LoadingSpinner />
  </div>
);

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState([true, false, false, false, false]);

  // Marcar que el componente se ha montado en el cliente
  useEffect(() => {
    setIsClient(true);

    // Cargar componentes no críticos después de que la página principal esté lista
    const timer = setTimeout(() => {
      setIsVisible([true, true, true, true, true]);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return <LoadingPlaceholder height="h-screen" />;
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section - Carga inmediata */}
      <HeroSection />
      
      {/* Secciones con carga diferida */}
      <Suspense fallback={<LoadingPlaceholder />}>
        {isVisible[0] && <CursoDisponible />}
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        {isVisible[1] && <Price />}
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        {isVisible[2] && <InstuctoresCard />}
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        {isVisible[3] && <TestimonioCard />}
      </Suspense>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        {isVisible[4] && <CtaButton />}
      </Suspense>
    </div>
  );
}

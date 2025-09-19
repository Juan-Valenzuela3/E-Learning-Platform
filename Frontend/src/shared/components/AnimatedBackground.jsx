import React from 'react';

/**
 * Componente de fondo animado con círculos difuminados
 * Reutilizable para aplicar en diferentes layouts
 */
export default function AnimatedBackground({
  className = '',
  variant = 'default' // 'default', 'subtle', 'intense'
}) {
  const variants = {
    default: {
      circle1: 'w-72 h-72 bg-red-100 opacity-30',
      circle2: 'w-96 h-96 bg-gray-200 opacity-20'
    },
    subtle: {
      circle1: 'w-64 h-64 bg-red-50 opacity-20',
      circle2: 'w-80 h-80 bg-gray-100 opacity-15'
    },
    intense: {
      circle1: 'w-96 h-96 bg-red-200 opacity-40',
      circle2: 'w-[28rem] h-[28rem] bg-gray-300 opacity-25'
    }
  };

  const currentVariant = variants[variant] || variants.default;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Círculo superior derecho */}
      <div className={`
        absolute top-0 right-0 rounded-full mix-blend-multiply filter blur-xl animate-pulse
        ${currentVariant.circle1}
      `}></div>

      {/* Círculo inferior izquierdo */}
      <div className={`
        absolute bottom-0 left-0 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700
        ${currentVariant.circle2}
      `}></div>
    </div>
  );
}
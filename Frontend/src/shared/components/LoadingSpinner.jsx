import React from 'react';

/**
 * Componente de spinner de carga con opciones de tamaño, color y texto.
 * Utiliza clases de Tailwind CSS predefinidas para un correcto funcionamiento.
 */
export default function LoadingSpinner({
  className = '',
  size = 'md',
  text = 'Cargando...',
  fullScreen = false,
  color = 'red' // red, blue, green, yellow, indigo, purple, pink
}) {
  // Objeto de clases estáticas que Tailwind puede detectar.
  const classes = {
    // Clases para el tamaño del spinner
    spinner: {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-2',
      lg: 'h-12 w-12 border-[3px]',
      xl: 'h-16 w-16 border-[4px]'
    },
    // Clases para el color del borde superior
    colorBorder: {
      red: 'border-t-red-500',
      blue: 'border-t-blue-500',
      green: 'border-t-green-500',
      yellow: 'border-t-yellow-500',
      indigo: 'border-t-indigo-500',
      purple: 'border-t-purple-500',
      pink: 'border-t-pink-500'
    },
    // Clases para el color del borde base
    colorBase: {
      red: 'border-red-100',
      blue: 'border-blue-100',
      green: 'border-green-100',
      yellow: 'border-yellow-100',
      indigo: 'border-indigo-100',
      purple: 'border-purple-100',
      pink: 'border-pink-100'
    },
    // Clases para el tamaño del texto
    text: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    }
  };

  // Clases del contenedor principal
  const containerClasses = `
    flex flex-col items-center justify-center gap-3 
    ${fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : ''}
    ${className}
  `;

  // Comprueba que el color y el tamaño seleccionados existan, si no, usa el valor por defecto
  const spinnerSizeClass = classes.spinner[size] || classes.spinner.md;
  const spinnerColorBorderClass = classes.colorBorder[color] || classes.colorBorder.red;
  const spinnerColorBaseClass = classes.colorBase[color] || classes.colorBase.red;
  const textSizeClass = classes.text[size] || classes.text.md;

  return (
    <div className={containerClasses}>
      <div className={`
        animate-spin rounded-full
        ${spinnerSizeClass}
        ${spinnerColorBaseClass}
        ${spinnerColorBorderClass}
      `}></div>
      {text && (
        <p className={`${textSizeClass} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}
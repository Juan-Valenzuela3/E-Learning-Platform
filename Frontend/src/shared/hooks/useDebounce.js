// src/hooks/useDebounce.js

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para aplicar 'debouncing' a un valor.
 * Retrasa la actualización del valor hasta que un período de tiempo
 * haya transcurrido sin nuevos cambios.
 *
 * @param {any} value - El valor que quieres 'deboncear' (ej: el input del usuario).
 * @param {number} delay - El tiempo en milisegundos para esperar antes de actualizar el valor.
 * @returns {any} El valor 'debonceado'.
 */
export function useDebounce(value, delay) {
  // Estado para almacenar el valor 'debonceado'
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // ⏰ Configura un temporizador para actualizar el valor después del retraso
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 🧹 La función de limpieza se ejecuta si 'value' o 'delay' cambian
    // o si el componente se desmonta. Esto previene que el temporizador
    // anterior se dispare con un valor obsoleto.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo vuelve a ejecutar el efecto si 'value' o 'delay' cambian

  return debouncedValue;
}
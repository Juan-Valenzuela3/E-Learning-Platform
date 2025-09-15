import { useState, useCallback, useRef } from 'react';

export function useAsync(asyncFunction, options = {}) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'pending' | 'success' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const optionsRef = useRef(options);
  
  // Actualizar la referencia de opciones cuando cambian
  optionsRef.current = options;

  const execute = useCallback(async (...args) => {
    try {
      setStatus('pending');
      setError(null);
      
      const result = await asyncFunction(...args);
      
      setData(result);
      setStatus('success');
      
      // Llamar a onSuccess si está definido
      if (typeof optionsRef.current.onSuccess === 'function') {
        optionsRef.current.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setStatus('error');
      
      // Llamar a onError si está definido
      if (typeof optionsRef.current.onError === 'function') {
        optionsRef.current.onError(error);
      } else {
        // Si no hay manejador de error, lanzar la excepción
        throw error;
      }
    }
  }, [asyncFunction]);

  return {
    // Estados
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    
    // Datos y error
    data,
    error,
    
    // Métodos
    execute,
    
    // Setters para actualización manual
    setData,
    setError,
    
    // Estado actual (para casos avanzados)
    status,
  };
}

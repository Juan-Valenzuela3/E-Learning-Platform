// src/features/test/TestConnection.jsx
import { useEffect, useState } from 'react';
import api from '@/services/apiConnection';

const TestConnection = () => {
  const [message, setMessage] = useState('Probando conexión con el backend...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        setIsLoading(true);
        
        
        console.log('Probando conexión con:', import.meta.env.VITE_API_URL);
        
        const response = await api.get('/api/courses');
        setMessage(`✅ Conexión exitosa: Catálogo obtenido (${response.data.length} cursos disponibles)`);
        
      } catch (error) {
        console.error('Error completo:', error);
        
        if (error.response) {
          // El servidor respondió con un código de error
          setMessage(`❌ Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          // La petición se hizo pero no hubo respuesta
          setMessage(`❌ Sin respuesta del servidor. Verifica la conexión a: ${import.meta.env.VITE_API_URL}`);
        } else {
          // Error en la configuración de la petición
          setMessage(`❌ Error de configuración: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    testBackendConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🔗 Test de Conexión Backend
        </h1>
        
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>URL del Backend:</strong> <code>{import.meta.env.VITE_API_URL || 'No configurada'}</code>
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Endpoint de prueba:</strong> <code>GET /api/courses</code>
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            isLoading 
              ? 'bg-yellow-50 border-yellow-200' 
              : message.startsWith('✅') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
          } border`}>
            <p className="font-medium">
              {isLoading ? '⏳ Probando conexión...' : message}
            </p>
          </div>
          
          {import.meta.env.VITE_DEBUG_MODE === 'true' && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600">
                Debug mode activado - Variables de entorno cargadas
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
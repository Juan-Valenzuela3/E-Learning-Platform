import React from 'react';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, VideoCameraIcon, PhotoIcon, SparklesIcon } from '@heroicons/react/24/outline';

const VideoProductionGuide = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Guía de Producción de Videos para Cursos</h1>
        <p className="text-lg text-gray-600">Consejos profesionales para crear contenido de alta calidad</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <VideoCameraIcon className="h-8 w-8 text-indigo-600 mr-2" />
          Configuración Recomendada
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">📱 Dispositivo Mínimo Recomendado</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Resolución: Mínimo 1080p (Full HD)</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Formato: MP4 (H.264)</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Relación de aspecto: 16:9</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🔊 Audio de Calidad</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Usa micrófono externo si es posible</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Graba en un lugar silencioso</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Prueba el audio antes de grabar</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Fondo Físico */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PhotoIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Fondo Físico</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Pared lisa de color neutro</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Buena iluminación frontal</span>
              </li>
              <li className="flex items-start">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Evitar fondos recargados</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fondo Virtual */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Fondo Virtual</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Usa pantalla verde bien iluminada</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Fondos profesionales y estáticos</span>
              </li>
              <li className="flex items-start">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Evitar animaciones molestas</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Presentación */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <LightBulbIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 ml-3">Presentación</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Diapositivas limpias y profesionales</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Incluye tu logo</span>
              </li>
              <li className="flex items-start">
                <XCircleIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Evitar texto excesivo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <LightBulbIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Consejo profesional:</strong> Graba en un entorno tranquilo y con buena iluminación. 
              La calidad del audio es tan importante como la calidad del video para una experiencia de aprendizaje óptima.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">📌 Consejos Adicionales</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">🎯 Antes de Grabar</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Prepara un guión o esquema</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Revisa la iluminación</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Haz una prueba de audio y video</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Elige ropa que contraste con el fondo</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">💡 Durante la Grabación</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Habla claro y a un ritmo moderado</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Mantén contacto visual con la cámara</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Usa gestos naturales</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Mantén una postura erguida</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoProductionGuide;
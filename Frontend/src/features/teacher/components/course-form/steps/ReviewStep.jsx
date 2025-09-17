import React from 'react';
import PropTypes from 'prop-types';
import { Check, Video, FileText, Clock } from 'lucide-react';

const ReviewStep = ({ course }) => {
  // Calcular la duración total del curso
  const calculateTotalDuration = () => {
    return course.sections.reduce((total, section) => {
      return total + section.lectures.reduce((sectionTotal, lecture) => {
        // Asumimos que la duración está en formato "MM:SS"
        const [minutes, seconds] = (lecture.duration || '5:00').split(':').map(Number);
        return sectionTotal + (minutes * 60) + (seconds || 0);
      }, 0);
    }, 0);
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hrs > 0) {
      return `${hrs} hora${hrs > 1 ? 's' : ''} ${mins} min`;
    }
    return `${mins} min`;
 };

  const totalDuration = calculateTotalDuration();
  const totalLectures = course.sections.reduce(
    (total, section) => total + section.lectures.length, 0
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Revisa tu curso</h2>
        <p className="text-gray-600 text-sm">
          Revisa la información de tu curso antes de publicarlo. Asegúrate de que todo esté correcto.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Resumen del curso
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Información general del curso que será visible para los estudiantes.
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Título</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {course.title || <span className="text-gray-400">Sin título</span>}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Subtítulo</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {course.subtitle || <span className="text-gray-400">Sin subtítulo</span>}
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Descripción</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-line">
                {course.description || <span className="text-gray-400">Sin descripción</span>}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Detalles</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Categoría</p>
                    <p className="text-gray-600">{course.category || 'No especificada'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Nivel</p>
                    <p className="text-gray-600 capitalize">{course.difficulty || 'No especificado'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Idioma</p>
                    <p className="text-gray-600">
                      {course.language === 'es' ? 'Español' : 
                       course.language === 'en' ? 'Inglés' : 
                       course.language === 'pt' ? 'Portugués' : 'No especificado'}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Precio</p>
                    <p className="text-gray-600">
                      ${course.price?.toFixed(2) || '0.00'}
                      {course.discountPrice > 0 && (
                        <span className="ml-2 text-sm text-red-600 line-through">
                          ${course.discountPrice.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Estadísticas</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex space-x-8">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{formatDuration(totalDuration)} de contenido</span>
                  </div>
                  <div className="flex items-center">
                    <Video className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{totalLectures} lecciones</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{course.sections.length} secciones</span>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Requisitos y lo que aprenderán */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Requisitos
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-2">
              {course.requirements && course.requirements.length > 0 ? (
                course.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No se han especificado requisitos.</p>
              )}
            </ul>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lo que aprenderán
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="space-y-2">
              {course.learningOutcomes && course.learningOutcomes.length > 0 ? (
                course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No se han especificado objetivos de aprendizaje.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Estructura del curso */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Estructura del curso
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {totalLectures} lecciones • {formatDuration(totalDuration)}
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {course.sections.map((section, sectionIndex) => (
            <div key={section.id} className="px-4 py-5 sm:p-6">
              <h4 className="font-medium text-gray-900 mb-3">
                Sección {sectionIndex + 1}: {section.title}
              </h4>
              
              <ul className="space-y-3">
                {section.lectures.map((lecture, lectureIndex) => (
                  <li key={lecture.id} className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-3">
                      {lecture.type === 'video' ? (
                        <Video className="h-5 w-5" />
                      ) : lecture.type === 'quiz' ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {lecture.title || 'Lección sin título'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {lecture.type === 'video' ? 'Video' : 
                         lecture.type === 'quiz' ? 'Cuestionario' : 'Documento'} • {lecture.duration || '5:00'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Revisa cuidadosamente toda la información antes de publicar. Una vez publicado, los estudiantes podrán inscribirse en tu curso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ReviewStep.propTypes = {
  course: PropTypes.object.isRequired
};

export default ReviewStep;

import React from 'react';
import PropTypes from 'prop-types';
import { Plus, X } from 'lucide-react';

const RequirementsStep = ({ course, setCourse }) => {
  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...course[arrayName]];
    newArray[index] = value;
    setCourse(prev => ({
      ...prev,
      [arrayName]: newArray
    }));
  };

  const addArrayItem = (arrayName, value = '') => {
    setCourse(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], value]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (course[arrayName].length > 1) {
      const newArray = course[arrayName].filter((_, i) => i !== index);
      setCourse(prev => ({
        ...prev,
        [arrayName]: newArray
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Requisitos y objetivos</h2>
        <p className="text-gray-600 text-sm">
          Especifica qué necesitan saber los estudiantes y qué aprenderán en tu curso.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Requisitos del curso <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(Mínimo 1 requerido)</span>
            </label>
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </button>
          </div>
          
          <div className="space-y-2">
            {course.requirements.map((req, index) => (
              <div key={`req-${index}`} className="flex items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder={`Requisito ${index + 1}`}
                    required={index === 0}
                  />
                </div>
                {course.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('requirements', index)}
                    className="p-2 border border-l-0 border-gray-300 rounded-r-md text-gray-500 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Lo que aprenderán <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(Mínimo 1 requerido)</span>
            </label>
            <button
              type="button"
              onClick={() => addArrayItem('learningOutcomes')}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Agregar
            </button>
          </div>
          
          <div className="space-y-2">
            {course.learningOutcomes.map((outcome, index) => (
              <div key={`outcome-${index}`} className="flex items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                    placeholder={`Lo que aprenderán ${index + 1}`}
                    required={index === 0}
                  />
                </div>
                {course.learningOutcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('learningOutcomes', index)}
                    className="p-2 border border-l-0 border-gray-300 rounded-r-md text-gray-500 hover:bg-gray-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <p className="mt-2 text-xs text-gray-500">
            Describe los objetivos de aprendizaje en términos claros y medibles.
          </p>
        </div>
      </div>
    </div>
  );
};

RequirementsStep.propTypes = {
  course: PropTypes.object.isRequired,
  setCourse: PropTypes.func.isRequired
};

export default RequirementsStep;

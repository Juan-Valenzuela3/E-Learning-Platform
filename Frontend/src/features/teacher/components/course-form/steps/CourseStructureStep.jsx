import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Plus, X, ChevronDown, ChevronUp, Video, FileText } from 'lucide-react';

const CourseStructureStep = ({ course, setCourse }) => {
  const [expandedSections, setExpandedSections] = useState([0]); // Por defecto, la primera sección está expandida

  const toggleSection = (index) => {
    setExpandedSections(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Sección ${course.sections.length + 1}`,
      lectures: [
        { 
          id: Date.now() + 1, 
          title: 'Nueva lección', 
          type: 'video', 
          duration: '5:00' 
        }
      ]
    };
    
    setCourse(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    // Expandir la nueva sección
    setExpandedSections(prev => [...prev, course.sections.length]);
  };

  const updateSection = (sectionIndex, field, value) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value
    };
    
    setCourse(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const removeSection = (sectionIndex) => {
    if (course.sections.length <= 1) return; // No eliminar la última sección
    
    const updatedSections = course.sections.filter((_, i) => i !== sectionIndex);
    
    setCourse(prev => ({
      ...prev,
      sections: updatedSections.map((section, idx) => ({
        ...section,
        title: `Sección ${idx + 1}${section.title.replace(/^Sección \d+/, '')}`
      }))
    }));
    
    // Actualizar las secciones expandidas
    setExpandedSections(prev => 
      prev
        .filter(i => i !== sectionIndex)
        .map(i => i > sectionIndex ? i - 1 : i)
    );
  };

  const addLecture = (sectionIndex) => {
    const updatedSections = [...course.sections];
    const newLecture = {
      id: Date.now(),
      title: 'Nueva lección',
      type: 'video',
      duration: '5:00'
    };
    
    updatedSections[sectionIndex].lectures.push(newLecture);
    
    setCourse(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const updateLecture = (sectionIndex, lectureIndex, field, value) => {
    const updatedSections = [...course.sections];
    updatedSections[sectionIndex].lectures[lectureIndex] = {
      ...updatedSections[sectionIndex].lectures[lectureIndex],
      [field]: value
    };
    
    setCourse(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  const removeLecture = (sectionIndex, lectureIndex) => {
    const updatedSections = [...course.sections];
    
    // No eliminar la última lección de una sección
    if (updatedSections[sectionIndex].lectures.length <= 1) return;
    
    updatedSections[sectionIndex].lectures = updatedSections[sectionIndex].lectures.filter(
      (_, i) => i !== lectureIndex
    );
    
    setCourse(prev => ({
      ...prev,
      sections: updatedSections
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Estructura del curso</h2>
        <p className="text-gray-600 text-sm">
          Organiza tu curso en secciones y lecciones. Arrastra y suelta para reordenar.
        </p>
      </div>

      <div className="space-y-4">
        {course.sections.map((section, sectionIndex) => (
          <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleSection(sectionIndex)}
                  className="flex-1 flex items-center text-left font-medium text-gray-900"
                >
                  {expandedSections.includes(sectionIndex) ? (
                    <ChevronUp className="h-5 w-5 mr-2 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 mr-2 text-gray-500" />
                  )}
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                    className="bg-transparent border-0 p-0 focus:ring-0 focus:outline-none text-base font-medium flex-1"
                    placeholder="Título de la sección"
                    required
                  />
                </button>
                
                {course.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-600"
                    title="Eliminar sección"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            {expandedSections.includes(sectionIndex) && (
              <div className="bg-white p-4">
                <div className="space-y-3">
                  {section.lectures.map((lecture, lectureIndex) => (
                    <div key={lecture.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex-shrink-0 text-gray-400">
                        {lecture.type === 'video' ? (
                          <Video className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={lecture.title}
                          onChange={(e) => updateLecture(sectionIndex, lectureIndex, 'title', e.target.value)}
                          className="w-full border-0 p-0 focus:ring-0 focus:outline-none text-sm"
                          placeholder="Título de la lección"
                          required
                        />
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <select
                            value={lecture.type}
                            onChange={(e) => updateLecture(sectionIndex, lectureIndex, 'type', e.target.value)}
                            className="text-xs border-0 p-0 pr-5 focus:ring-0 focus:outline-none bg-transparent"
                          >
                            <option value="video">Video</option>
                            <option value="document">Documento</option>
                            <option value="quiz">Cuestionario</option>
                          </select>
                          
                          <span className="mx-2">•</span>
                          
                          <input
                            type="text"
                            value={lecture.duration}
                            onChange={(e) => updateLecture(sectionIndex, lectureIndex, 'duration', e.target.value)}
                            className="w-16 text-xs border-0 p-0 focus:ring-0 focus:outline-none"
                            placeholder="5:00"
                          />
                        </div>
                      </div>
                      
                      {section.lectures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLecture(sectionIndex, lectureIndex)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Eliminar lección"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => addLecture(sectionIndex)}
                      className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar lección
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="pt-2">
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <Plus className="h-4 w-4 mr-1" />
            Agregar sección
          </button>
        </div>
      </div>
    </div>
  );
};

CourseStructureStep.propTypes = {
  course: PropTypes.object.isRequired,
  setCourse: PropTypes.func.isRequired
};

export default CourseStructureStep;

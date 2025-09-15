import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCourseForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: '',
    subcategory: '',
    difficulty: 'beginner',
    language: 'es',
    price: 0,
    discountPrice: 0,
    requirements: [''],
    learningOutcomes: [''],
    sections: [
      {
        id: Date.now(),
        title: 'Sección 1',
        lectures: [
          { id: Date.now() + 1, title: 'Introducción', type: 'video', duration: '5:00' }
        ]
      }
    ]
  });

  const steps = [
    { id: '1', name: 'Información básica' },
    { id: '2', name: 'Requisitos' },
    { id: '3', name: 'Estructura' },
    { id: '4', name: 'Revisar' }
  ];

  const validateStep = (currentStep) => {
    switch(currentStep) {
      case 1:
        return course.title.trim() !== '' && 
               course.subtitle.trim() !== '' &&
               course.description.trim() !== '' && 
               course.category.trim() !== '' &&
               course.difficulty.trim() !== '' &&
               course.language.trim() !== '';
      case 2:
        return course.requirements.some(req => req.trim() !== '') && 
               course.learningOutcomes.some(lo => lo.trim() !== '');
      case 3:
        return course.sections.every(section => 
          section.title.trim() !== '' && 
          section.lectures.every(lecture => lecture.title.trim() !== '')
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error('Por favor completa todos los campos requeridos antes de continuar');
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const handleSectionChange = (sectionId, field, value) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
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
  };

  const addLecture = (sectionId) => {
    setCourse(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              lectures: [
                ...section.lectures,
                {
                  id: Date.now(),
                  title: 'Nueva lección',
                  type: 'video',
                  duration: '5:00'
                }
              ]
            }
          : section
      )
    }));
  };

  const handleSubmit = async (e, status = 'draft') => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add your API call here
      console.log('Submitting course:', { ...course, status });
      
      toast.success(
        status === 'draft' 
          ? 'Borrador guardado correctamente' 
          : '¡Curso publicado exitosamente!'
      );
      
      navigate('/teacher/courses');
    } catch (error) {
      console.error('Error al guardar el curso:', error);
      const message = status === 'draft' 
        ? 'Error al guardar el borrador. Por favor, inténtalo de nuevo.'
        : 'Error al publicar el curso. Por favor, inténtalo de nuevo.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Step components
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Información básica del curso</h2>
        <p className="text-gray-600 text-sm">Completa la información básica de tu curso para que los estudiantes sepan de qué se trata.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del curso <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Título del curso"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtítulo <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-1">(Aparecerá en la página principal)</span>
          </label>
          <input
            type="text"
            name="subtitle"
            value={course.subtitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Subtítulo atractivo para tu curso"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría principal <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={course.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="programming">Programación</option>
            <option value="design">Diseño</option>
            <option value="business">Negocios</option>
            <option value="marketing">Marketing</option>
            <option value="lifestyle">Estilo de vida</option>
            <option value="academic">Académico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategoría
          </label>
          <input
            type="text"
            name="subcategory"
            value={course.subcategory}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Ej: Desarrollo Web, Marketing Digital, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel de dificultad <span className="text-red-500">*</span>
          </label>
          <select
            name="difficulty"
            value={course.difficulty}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
            <option value="all">Todos los niveles</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idioma <span className="text-red-500">*</span>
          </label>
          <select
            name="language"
            value={course.language}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="pt">Portugués</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (USD) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              value={course.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio con descuento (opcional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="discountPrice"
              value={course.discountPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción detallada <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 ml-1">(Puedes usar formato Markdown)</span>
        </label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          placeholder="Describe el contenido de tu curso..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={course.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          required
        >
          <option value="">Selecciona una categoría</option>
          <option value="programming">Programación</option>
          <option value="design">Diseño</option>
          <option value="business">Negocios</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Requisitos y objetivos</h2>
        <p className="text-gray-600 text-sm">Especifica qué necesitan saber los estudiantes y qué aprenderán.</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Requisitos</label>
          <button
            type="button"
            onClick={() => addArrayItem('requirements')}
            className="text-sm text-red-600 hover:text-red-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Agregar
          </button>
        </div>
        
        {course.requirements.map((req, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={req}
              onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder={`Requisito ${index + 1}`}
              required
            />
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

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Lo que aprenderán</label>
          <button
            type="button"
            onClick={() => addArrayItem('learningOutcomes')}
            className="text-sm text-red-600 hover:text-red-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Agregar
          </button>
        </div>
        
        {course.learningOutcomes.map((outcome, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={outcome}
              onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder={`Objetivo de aprendizaje ${index + 1}`}
              required
            />
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Estructura del curso</h2>
        <p className="text-gray-600 text-sm">Organiza tu curso en secciones y lecciones.</p>
      </div>

      <div className="space-y-4">
        {course.sections.map((section, sectionIndex) => (
          <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <div className="flex-1">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                  className="w-full bg-transparent font-medium text-gray-900 focus:outline-none focus:ring-0 border-0 p-0"
                  placeholder="Título de la sección"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => addLecture(section.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
                {course.sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newSections = course.sections.filter(s => s.id !== section.id);
                      setCourse(prev => ({ ...prev, sections: newSections }));
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {section.lectures.map((lecture, lectureIndex) => (
                <div key={lecture.id} className="px-4 py-3 flex items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={lecture.title}
                      onChange={(e) => {
                        const updatedSections = [...course.sections];
                        updatedSections[sectionIndex].lectures[lectureIndex].title = e.target.value;
                        setCourse(prev => ({ ...prev, sections: updatedSections }));
                      }}
                      className="w-full bg-transparent text-gray-900 focus:outline-none focus:ring-0 border-0 p-0"
                      placeholder="Título de la lección"
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={lecture.type}
                      onChange={(e) => {
                        const updatedSections = [...course.sections];
                        updatedSections[sectionIndex].lectures[lectureIndex].type = e.target.value;
                        setCourse(prev => ({ ...prev, sections: updatedSections }));
                      }}
                      className="text-sm border-0 bg-transparent text-gray-500 focus:ring-0 focus:ring-offset-0 p-0"
                    >
                      <option value="video">Video</option>
                      <option value="text">Texto</option>
                      <option value="quiz">Cuestionario</option>
                    </select>
                    <span className="text-sm text-gray-500">{lecture.duration}</span>
                    {section.lectures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSections = [...course.sections];
                          updatedSections[sectionIndex].lectures = updatedSections[sectionIndex].lectures.filter(
                            (_, idx) => idx !== lectureIndex
                          );
                          setCourse(prev => ({ ...prev, sections: updatedSections }));
                        }}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addSection}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:border-gray-400"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar sección
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Revisar y publicar</h2>
        <p className="text-gray-600 text-sm">Revisa la información de tu curso antes de publicarlo.</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-3">Vista previa del curso</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Título</h4>
            <p className="mt-1 text-gray-900">{course.title || 'No especificado'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
            <p className="mt-1 text-gray-900 whitespace-pre-line">{course.description || 'No especificada'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Categoría</h4>
            <p className="mt-1 text-gray-900">{course.category || 'No especificada'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Requisitos</h4>
            <ul className="mt-1 list-disc list-inside">
              {course.requirements.some(r => r.trim() !== '') ? (
                course.requirements
                  .filter(req => req.trim() !== '')
                  .map((req, i) => (
                    <li key={i} className="text-gray-900">{req}</li>
                  ))
              ) : (
                <li className="text-gray-500">No especificados</li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Lo que aprenderán</h4>
            <ul className="mt-1 list-disc list-inside">
              {course.learningOutcomes.some(lo => lo.trim() !== '') ? (
                course.learningOutcomes
                  .filter(lo => lo.trim() !== '')
                  .map((lo, i) => (
                    <li key={i} className="text-gray-900">{lo}</li>
                  ))
              ) : (
                <li className="text-gray-500">No especificados</li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Estructura del curso</h4>
            <div className="mt-2 space-y-4">
              {course.sections.map((section, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h5 className="font-medium text-gray-900">{section.title || `Sección ${i + 1}`}</h5>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {section.lectures.map((lecture, j) => (
                      <li key={j} className="px-4 py-3 flex items-center">
                        <span className="flex-1 text-gray-900">{lecture.title || `Lección ${j + 1}`}</span>
                        <span className="text-sm text-gray-500">{lecture.type} • {lecture.duration}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const stepComponents = [
    renderStep1,
    renderStep2,
    renderStep3,
    renderStep4
  ];

  const currentStepComponent = stepComponents[step - 1];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Crear nuevo curso</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completa todos los pasos para publicar tu curso.
        </p>
      </div>

      {/* Stepper */}
      <nav className="flex items-center justify-center mb-8">
        <ol className="flex items-center w-full">
          {steps.map((stepItem, index) => (
            <li 
              key={stepItem.id}
              className={`flex items-center ${
                index !== steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step > index + 1 || (step === index + 1 && validateStep(step))
                      ? 'bg-red-100 text-red-600'
                      : step === index + 1
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > index + 1 || (step === index + 1 && validateStep(step)) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span 
                  className={`mt-2 text-xs font-medium ${
                    step >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {stepItem.name}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center">
                  <div className="w-full h-0.5 bg-gray-200"></div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form onSubmit={(e) => handleSubmit(e, 'published')} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {currentStepComponent && currentStepComponent()}
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-6 py-3 flex justify-between border-t border-gray-200">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={loading}
              >
                <ChevronLeft className="h-5 w-5 mr-1" /> Anterior
              </button>
            )}
          </div>
          
          <div className="space-x-3">
            {step < steps.length ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSubmit(new Event('submit'), 'draft')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar borrador'}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={loading || !validateStep(step)}
                >
                  Siguiente <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar curso'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;

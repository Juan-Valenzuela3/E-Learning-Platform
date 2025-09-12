import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon, TrashIcon, VideoCameraIcon, DocumentTextIcon, PencilIcon } from '@heroicons/react/24/outline';

const NewCourse = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    level: 'beginner',
    image: null,
    preview: null,
    modules: [
      {
        id: Date.now(),
        title: 'Módulo 1',
        description: '',
        lessons: [
          {
            id: Date.now() + 1,
            title: 'Introducción',
            type: 'video',
            video: null,
            duration: 0,
            resources: []
          }
        ]
      }
    ]
  });

  const [activeModule, setActiveModule] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del curso si estamos en modo edición
  useEffect(() => {
    if (isEditing && id) {
      // Aquí iría la llamada a la API para obtener los datos del curso
      const fetchCourse = async () => {
        try {
          // Simulamos una llamada a la API
          // const response = await api.get(`/courses/${id}`);
          // setFormData(response.data);
          
          // Datos de ejemplo para la demo
          setFormData({
            title: 'Curso de Ejemplo',
            description: 'Este es un curso de ejemplo para demostrar la funcionalidad de edición.',
            category: 'programming',
            price: '49.99',
            level: 'beginner',
            image: null,
            preview: 'https://via.placeholder.com/1280x720',
            modules: [
              {
                id: 1,
                title: 'Introducción al Curso',
                description: 'Aprende los conceptos básicos',
                lessons: [
                  {
                    id: 1,
                    title: 'Bienvenida',
                    type: 'video',
                    video: {
                      preview: 'https://example.com/video-preview.mp4',
                      name: 'bienvenida.mp4',
                      duration: 5
                    },
                    duration: 5,
                    resources: []
                  }
                ]
              }
            ]
          });
        } catch (error) {
          console.error('Error al cargar el curso:', error);
          // Mostrar mensaje de error
        }
      };
      
      fetchCourse();
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: files[0],
          preview: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Agregar campos básicos
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('level', formData.level);
      
      // Agregar imagen si existe
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      
      // Agregar módulos y lecciones
      formDataToSend.append('modules', JSON.stringify(formData.modules));
      
      // Determinar la URL y el método HTTP según si es edición o creación
      const url = isEditing && id 
        ? `/api/courses/${id}` 
        : '/api/courses';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Llamada a la API
      // const response = await fetch(url, {
      //   method,
      //   body: formDataToSend,
      //   headers: {
      //     'Accept': 'application/json',
      //   },
      // });
      
      // if (!response.ok) throw new Error('Error al guardar el curso');
      
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirigir después de guardar
      navigate('/teacher/courses');
      
      // Mostrar notificación de éxito
      alert(`Curso ${isEditing ? 'actualizado' : 'creado'} exitosamente!`);
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al ${isEditing ? 'actualizar' : 'crear'} el curso. Por favor, inténtalo de nuevo.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: `Módulo ${formData.modules.length + 1}`,
      description: '',
      lessons: []
    };
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
    setActiveModule(formData.modules.length);
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const removeModule = (index) => {
    if (formData.modules.length === 1) return; // No eliminar el último módulo
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
    if (activeModule >= updatedModules.length) {
      setActiveModule(updatedModules.length - 1);
    }
  };

  const addLesson = (moduleIndex, type = 'video') => {
    const newLesson = {
      id: Date.now(),
      title: type === 'video' ? 'Nuevo video' : 'Nuevo documento',
      type,
      video: null,
      duration: 0,
      resources: []
    };
    
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons = [...updatedModules[moduleIndex].lessons, newLesson];
    
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons[lessonIndex] = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    
    setFormData(prev => ({
      ...prev,
      modules: updatedModules
    }));
  };

  const handleVideoUpload = (e, moduleIndex, lessonIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // Crear vista previa del video
    const videoUrl = URL.createObjectURL(file);
    
    // Actualizar la lección con el video
    updateLesson(moduleIndex, lessonIndex, 'video', {
      file,
      preview: videoUrl,
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Obtener duración del video (opcional)
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      updateLesson(moduleIndex, lessonIndex, 'duration', Math.round(video.duration / 60));
    };
    video.src = URL.createObjectURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a mis cursos
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing 
            ? 'Actualiza la información de tu curso.'
            : 'Completa la información básica de tu curso. Podrás agregar más detalles después.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Imagen del curso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del curso
          </label>
          <div className="mt-1 flex items-center">
            <div className="w-32 h-32 rounded-md overflow-hidden bg-gray-100">
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <PlusIcon className="h-12 w-12" />
                </div>
              )}
            </div>
            <label className="ml-5">
              <div className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Subir imagen
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleChange}
                />
              </div>
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Sube una imagen representativa de tu curso (recomendado: 1280x720px)
          </p>
        </div>

        {/* Título del curso */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título del curso
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              id="title"
              required
              maxLength={100}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Ej: Introducción a la Programación en Python"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="¿De qué trata tu curso? Describe los temas que cubrirás y qué aprenderán los estudiantes."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Mínimo 200 caracteres
          </p>
        </div>

        {/* Categoría y Nivel */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              <option value="programming">Programación</option>
              <option value="design">Diseño</option>
              <option value="business">Negocios</option>
              <option value="marketing">Marketing</option>
              <option value="photography">Fotografía</option>
              <option value="music">Música</option>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Nivel
            </label>
            <select
              id="level"
              name="level"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={formData.level}
              onChange={handleChange}
            >
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
        </div>

        {/* Precio */}
        <div className="w-1/3">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Precio (USD)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.01"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                USD
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Módulos y Lecciones */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Estructura del Curso</h2>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Lista de módulos */}
            <div className="w-full md:w-1/3 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Módulos</h3>
                <button
                  type="button"
                  onClick={addModule}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  + Agregar módulo
                </button>
              </div>
              
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {formData.modules.map((module, moduleIndex) => (
                  <div 
                    key={module.id}
                    className={`p-3 rounded-lg cursor-pointer ${activeModule === moduleIndex ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'bg-white border'}`}
                    onClick={() => setActiveModule(moduleIndex)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-gray-500">
                          {module.lessons.length} lección{module.lessons.length !== 1 ? 'es' : ''}
                        </p>
                      </div>
                      {formData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeModule(moduleIndex);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Detalles del módulo activo */}
            {formData.modules[activeModule] && (
              <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del módulo
                  </label>
                  <input
                    type="text"
                    value={formData.modules[activeModule].title}
                    onChange={(e) => updateModule(activeModule, 'title', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Ej: Introducción al curso"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del módulo
                  </label>
                  <textarea
                    value={formData.modules[activeModule].description}
                    onChange={(e) => updateModule(activeModule, 'description', e.target.value)}
                    rows="3"
                    className="w-full p-2 border rounded"
                    placeholder="Describe los objetivos de este módulo"
                  />
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Lecciones</h4>
                    <div className="space-x-2">
                      <button
                        type="button"
                        onClick={() => addLesson(activeModule, 'video')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <VideoCameraIcon className="h-4 w-4 mr-1" />
                        Video
                      </button>
                      <button
                        type="button"
                        onClick={() => addLesson(activeModule, 'document')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                        Documento
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.modules[activeModule].lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => updateLesson(activeModule, lessonIndex, 'title', e.target.value)}
                              className="w-full font-medium bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none"
                              placeholder="Título de la lección"
                            />
                            
                            {lesson.type === 'video' ? (
                              <div className="mt-2">
                                {lesson.video ? (
                                  <div className="mt-2">
                                    <video 
                                      src={lesson.video.preview} 
                                      controls 
                                      className="w-full h-40 bg-black rounded"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      {lesson.video.name} • {lesson.duration} min
                                    </p>
                                  </div>
                                ) : (
                                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                      <VideoCameraIcon className="h-8 w-8 text-gray-400 mb-2" />
                                      <p className="text-sm text-gray-500">
                                        <span className="font-semibold">Haz clic para subir</span> o arrastra un video
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        MP4, WebM o MOV (máx. 500MB)
                                      </p>
                                    </div>
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="video/*"
                                      onChange={(e) => handleVideoUpload(e, activeModule, lessonIndex)}
                                    />
                                  </label>
                                )}
                              </div>
                            ) : (
                              <div className="mt-2">
                                <textarea
                                  rows="3"
                                  className="w-full p-2 border rounded text-sm"
                                  placeholder="Escribe el contenido de la lección aquí..."
                                  value={lesson.content || ''}
                                  onChange={(e) => updateLesson(activeModule, lessonIndex, 'content', e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeLesson(activeModule, lessonIndex)}
                            className="ml-2 text-gray-400 hover:text-red-500"
                            title="Eliminar lección"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creando curso...' : 'Crear curso'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewCourse;

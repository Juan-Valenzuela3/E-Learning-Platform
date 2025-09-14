import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, X, ArrowLeft, Image as ImageIcon, Video, FileText, Link as LinkIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);
  const [course, setCourse] = useState({
    title: 'Nuevo Curso',
    description: '',
    image: '',
    content: '# Título del Curso\n\nEscribe aquí el contenido de tu curso...',
    modules: [],
    status: 'draft',
  });

  // Simular carga de datos del curso
  useEffect(() => {
    if (id) {
      // Aquí iría la llamada a la API para cargar el curso
      const fetchCourse = async () => {
        // Simular carga
        setTimeout(() => {
          setCourse({
            title: 'Introducción a React',
            description: 'Aprende los fundamentos de React desde cero',
            image: 'https://via.placeholder.com/800x450',
            content: '# Introducción a React\n\n## ¿Qué es React?\n\nReact es una biblioteca de JavaScript para construir interfaces de usuario...',
            modules: [
              { id: 1, title: 'Introducción', duration: '15 min' },
              { id: 2, title: 'Componentes', duration: '25 min' },
              { id: 3, title: 'Estado y Props', duration: '30 min' },
            ],
            status: 'draft',
          });
        }, 500);
      };
      fetchCourse();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (e) => {
    setCourse(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      // Aquí iría la lógica para guardar el curso
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Curso guardado exitosamente');
    } catch (error) {
      toast.error('Error al guardar el curso');
    }
  };

  const renderPreview = () => {
    // Simple markdown renderer para la vista previa
    const renderMarkdown = (text) => {
      return text
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 my-4">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 my-3">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-800 my-2">$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, ' ');
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {course.image && (
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-48 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>
        
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(course.content) }}
        />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Módulos del Curso</h2>
          <div className="space-y-2">
            {course.modules.map(module => (
              <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.duration}</p>
                </div>
                <button className="text-red-500 hover:text-red-600">
                  <Play className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Editar Curso' : 'Nuevo Curso'}
          </h1>
        </div>
        
        <div className="flex space-x-3 w-full sm:w-auto">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              previewMode 
                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
                : 'bg-red-50 text-red-600 hover:bg-red-100'
            }`}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Editar' : 'Vista Previa'}
          </button>
          
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {!previewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Panel de edición */}
            <div className="lg:col-span-2 p-6 border-r border-gray-200">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Curso
                </label>
                <input
                  type="text"
                  name="title"
                  value={course.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Ej: Introducción a React"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={course.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                  placeholder="Describe brevemente de qué trata el curso"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen de portada
                </label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt="Course cover"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </span>
                  <button
                    type="button"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Cambiar
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Contenido del Curso
                  </label>
                  <div className="text-xs text-gray-500">
                    Soporta formato Markdown
                  </div>
                </div>
                <textarea
                  name="content"
                  value={course.content}
                  onChange={handleContentChange}
                  rows="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 font-mono text-sm"
                  placeholder="Escribe el contenido de tu curso usando Markdown..."
                />
              </div>
            </div>

            {/* Panel lateral - Módulos y configuración */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Módulos</h3>
              
              <div className="space-y-3 mb-6">
                {course.modules.map(module => (
                  <div key={module.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      <p className="text-sm text-gray-500">{module.duration}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md text-gray-600 hover:text-gray-700 hover:border-gray-400">
                <Plus className="w-5 h-5 mr-2" />
                Agregar Módulo
              </button>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado del Curso
                    </label>
                    <select
                      name="status"
                      value={course.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel de Dificultad
                    </label>
                    <select
                      name="difficulty"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    >
                      <option>Principiante</option>
                      <option>Intermedio</option>
                      <option>Avanzado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseEditor;



// === VERSIÓN MEJORADA CON DISEÑO EDUPLATFORM ===
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { getCourseById, updateCourse, getCategories, getSubcategoriesByCategory } from '@/services/courseService';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import {
  Save,
  ArrowLeft,
  Trash2,
  Upload,
  Plus,
  Minus,
  DollarSign,
  Clock,
  Tag,
  Video,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit3
} from 'lucide-react';

const EditCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const { user } = useAuth();

  // Estados
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    subcategoryId: '',
    price: 0,
    estimatedHours: 1,
    thumbnailUrl: '',
    youtubeUrls: [''],
    isPremium: false,
    isPublished: false,
    isActive: true
  });

  // Errores de validación
  const [formErrors, setFormErrors] = useState({});

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseById(courseId);
        const categoriesData = await getCategories();

        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          shortDescription: courseData.shortDescription || '',
          categoryId: courseData.category?.id ? String(courseData.category.id) : '',
          subcategoryId: courseData.subcategory?.id ? String(courseData.subcategory.id) : '',
          price: courseData.price || 0,
          estimatedHours: courseData.estimatedHours || 1,
          thumbnailUrl: courseData.thumbnailUrl || '',
          youtubeUrls: courseData.youtubeUrls?.length ? courseData.youtubeUrls : [''],
          isPremium: Boolean(courseData.isPremium),
          isPublished: Boolean(courseData.isPublished),
          isActive: courseData.isActive !== false
        });

        setCategories(categoriesData || []);

        if (courseData.category?.id) {
          const subcategoriesData = await getSubcategoriesByCategory(courseData.category.id);
          setSubcategories(subcategoriesData || []);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadInitialData();
    } else {
      setError('ID de curso no válido');
      setLoading(false);
    }
  }, [courseId]);

  // Manejar cambios en formulario
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'categoryId' && value) {
      loadSubcategories(value);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  };

  // Cargar subcategorías
  const loadSubcategories = async (categoryId) => {
    try {
      setLoadingSubcategories(true);
      const subcategoriesData = await getSubcategoriesByCategory(categoryId);
      setSubcategories(subcategoriesData || []);
    } catch (err) {
      console.error('Error al cargar subcategorías:', err);
      toast.error('Error al cargar subcategorías');
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Manejar URLs de YouTube
  const handleYoutubeUrlChange = (index, value) => {
    const newUrls = [...formData.youtubeUrls];
    newUrls[index] = value;
    setFormData(prev => ({ ...prev, youtubeUrls: newUrls }));
  };

  const addYoutubeUrl = () => {
    setFormData(prev => ({ ...prev, youtubeUrls: [...prev.youtubeUrls, ''] }));
  };

  const removeYoutubeUrl = (index) => {
    if (formData.youtubeUrls.length > 1) {
      const newUrls = formData.youtubeUrls.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, youtubeUrls: newUrls }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'El título es obligatorio';
    if (!formData.description.trim()) errors.description = 'La descripción es obligatoria';
    if (!formData.categoryId) errors.categoryId = 'La categoría es obligatoria';
    if (!formData.subcategoryId) errors.subcategoryId = 'La subcategoría es obligatoria';
    if (formData.price < 0) errors.price = 'El precio no puede ser negativo';
    if (formData.estimatedHours < 1 || formData.estimatedHours > 1000) {
      errors.estimatedHours = 'Las horas estimadas deben estar entre 1 y 1000';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    try {
      setSaving(true);

      if (!formData.categoryId || !formData.subcategoryId) {
        toast.error('Categoría y subcategoría son requeridas');
        return;
      }

      if (!user?.id) {
        toast.error('Error: Usuario no autenticado');
        return;
      }

      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        instructorId: parseInt(user.id),
        categoryId: parseInt(formData.categoryId),
        subcategoryId: parseInt(formData.subcategoryId),
        price: parseFloat(formData.price) || 0,
        estimatedHours: parseInt(formData.estimatedHours) || 1,
        isPremium: Boolean(formData.isPremium),
        isPublished: Boolean(formData.isPublished),
        isActive: Boolean(formData.isActive)
      };

      if (formData.shortDescription && formData.shortDescription.trim()) {
        courseData.shortDescription = formData.shortDescription.trim();
      }

      if (formData.thumbnailUrl && formData.thumbnailUrl.trim()) {
        courseData.thumbnailUrl = formData.thumbnailUrl.trim();
      }

      const validYoutubeUrls = formData.youtubeUrls
        .filter(url => url && url.trim() !== '')
        .map(url => url.trim());

      if (validYoutubeUrls.length > 0) {
        courseData.youtubeUrls = validYoutubeUrls;
      }

      await updateCourse(courseId, courseData);
      window.dispatchEvent(new CustomEvent('courseUpdated', { detail: { courseId } }));
      toast.success('Curso actualizado exitosamente');
      navigate('/teacher/courses');
    } catch (err) {
      if (err.message && err.message.includes('Errores de validación:')) {
        toast.error(err.message);
      } else {
        toast.error(err.message || 'Error al actualizar el curso');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando curso..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/teacher/courses')}
            className="inline-flex items-center px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a mis cursos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <button
                onClick={() => navigate('/teacher/courses')}
                className="mr-4 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
                <p className="text-gray-600 mt-1">Actualiza la información de tu curso</p>
              </div>
            </div>

            <div className="flex space-x-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate('/teacher/courses')}
                disabled={saving}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Cancelar
              </button>

              <button
                type="submit"
                form="course-form"
                disabled={saving}
                className="flex items-center px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de navegación */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { key: 'basic', label: 'Información Básica', icon: Edit3 },
                { key: 'media', label: 'Multimedia', icon: Video },
                { key: 'config', label: 'Configuración', icon: Tag }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === key
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <form id="course-form" onSubmit={handleSubmit} className="p-8">
            {/* Tab: Información Básica */}
            {activeTab === 'basic' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Información Básica del Curso</h2>

                  <div className="space-y-6">
                    {/* Título */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Título del Curso *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          formErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Ej: Introducción a React para Principiantes"
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.title}
                        </p>
                      )}
                    </div>

                    {/* Categorías */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <select
                          name="categoryId"
                          value={formData.categoryId}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                            formErrors.categoryId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Seleccionar categoría</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.categoryId && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.categoryId}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subcategoría *
                        </label>
                        <select
                          name="subcategoryId"
                          value={formData.subcategoryId}
                          onChange={handleChange}
                          disabled={!formData.categoryId || loadingSubcategories}
                          className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            formErrors.subcategoryId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        >
                          <option value="">
                            {loadingSubcategories ? 'Cargando...' : 'Seleccionar subcategoría'}
                          </option>
                          {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.subcategoryId && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.subcategoryId}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Descripción completa */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción Completa *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="6"
                        className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Describe detalladamente qué aprenderán los estudiantes en este curso..."
                      />
                      {formErrors.description ? (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {formErrors.description}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-gray-500">
                          Descripción detallada que se mostrará en la página del curso
                        </p>
                      )}
                    </div>

                    {/* Descripción corta */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción Corta
                      </label>
                      <textarea
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                        placeholder="Resumen breve del curso (opcional)"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Descripción breve que se mostrará en las tarjetas de curso
                      </p>
                    </div>

                    {/* Precio y Duración */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Precio
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                              formErrors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                        </div>
                        {formErrors.price ? (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.price}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-gray-500">
                            Dejar en 0 para hacer el curso gratuito
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Horas Estimadas
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            name="estimatedHours"
                            value={formData.estimatedHours}
                            onChange={handleChange}
                            min="1"
                            max="1000"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                              formErrors.estimatedHours ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="1"
                          />
                        </div>
                        {formErrors.estimatedHours && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {formErrors.estimatedHours}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Multimedia */}
            {activeTab === 'media' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenido Multimedia</h2>

                  {/* Imagen de portada */}
                  <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 text-center mb-8">
                    <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Imagen de Portada</h3>
                    <p className="text-gray-600 mb-4">Funcionalidad de upload próximamente</p>
                    <p className="text-sm text-gray-500 mb-4">Por ahora, usa una URL de imagen temporal</p>

                    <input
                      type="url"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  {/* Videos de YouTube */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Videos de YouTube</h3>
                        <p className="text-gray-600">Agrega URLs de videos para el contenido del curso</p>
                      </div>
                      <button
                        type="button"
                        onClick={addYoutubeUrl}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Video
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.youtubeUrls.map((url, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                          <div className="flex-shrink-0">
                            <Video className="w-6 h-6 text-red-500" />
                          </div>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => handleYoutubeUrlChange(index, e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                            placeholder={`https://www.youtube.com/watch?v=... (Video ${index + 1})`}
                          />
                          {formData.youtubeUrls.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeYoutubeUrl(index)}
                              className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Configuración */}
            {activeTab === 'config' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración del Curso</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Configuraciones */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Opciones del Curso</h3>

                      {/* Curso Premium */}
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isPremium"
                            checked={formData.isPremium}
                            onChange={handleChange}
                            className="w-5 h-5 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                          />
                          <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">Curso Premium</label>
                            <p className="text-xs text-gray-600">Marca este curso como premium</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          formData.isPremium ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {formData.isPremium ? 'PREMIUM' : 'ESTÁNDAR'}
                        </span>
                      </div>

                      {/* Curso Publicado */}
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">Publicar Curso</label>
                            <p className="text-xs text-gray-600">Hacer visible para los estudiantes</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          formData.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {formData.isPublished ? 'PÚBLICO' : 'BORRADOR'}
                        </span>
                      </div>

                      {/* Curso Activo */}
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <div className="ml-3">
                            <label className="text-sm font-medium text-gray-900">Curso Activo</label>
                            <p className="text-xs text-gray-600">Permite inscripciones y acceso</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          formData.isActive ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {formData.isActive ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </div>
                    </div>

                    {/* Estado actual */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-red-500 mr-2" />
                        Estado Actual del Curso
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Completitud:</span>
                          <div className="flex items-center">
                            {formData.title && formData.description ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {formData.title && formData.description ? 'Completo' : 'Incompleto'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Categorización:</span>
                          <div className="flex items-center">
                            {formData.categoryId && formData.subcategoryId ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {formData.categoryId && formData.subcategoryId ? 'Configurado' : 'Pendiente'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Multimedia:</span>
                          <div className="flex items-center">
                            {formData.thumbnailUrl || formData.youtubeUrls.some(url => url.trim()) ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-500 mr-1" />
                            )}
                            <span className="text-sm font-medium">
                              {formData.thumbnailUrl || formData.youtubeUrls.some(url => url.trim()) ? 'Configurado' : 'Opcional'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;

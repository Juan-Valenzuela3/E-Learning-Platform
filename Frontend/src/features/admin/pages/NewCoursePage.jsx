import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Save,
  X,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Link,
  ArrowLeft,
} from "lucide-react";
import api from "@/services/api";

const NewCoursePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    instructorId: "",
    categoryId: "",
    subcategoryId: "",
    youtubeUrls: [""],
    thumbnailUrl: "",
    price: 0,
    isPremium: false,
    isPublished: false,
    isActive: true,
    estimatedHours: 1,
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingData(true);

        // Cargar instructores (usuarios con rol INSTRUCTOR)
        const instructorsResponse = await api.get("/api/users/role/INSTRUCTOR");
        setInstructors(instructorsResponse.data || []);

        // Cargar categorías
        const categoriesResponse = await api.get("/api/categories");
        setCategories(categoriesResponse.data || []);
      } catch (err) {
        console.error("Error loading initial data:", err);
        setError("Error al cargar datos iniciales");
      } finally {
        setLoadingData(false);
      }
    };

    loadInitialData();
  }, []);

  // Cargar subcategorías cuando cambie la categoría
  useEffect(() => {
    const loadSubcategories = async () => {
      if (formData.categoryId) {
        try {
          const response = await api.get(
            `/api/subcategories/category/${formData.categoryId}`
          );
          setSubcategories(response.data || []);
          // Reset subcategory selection
          setFormData((prev) => ({ ...prev, subcategoryId: "" }));
        } catch (err) {
          console.error("Error loading subcategories:", err);
        }
      } else {
        setSubcategories([]);
        setFormData((prev) => ({ ...prev, subcategoryId: "" }));
      }
    };

    loadSubcategories();
  }, [formData.categoryId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleYoutubeUrlChange = (index, value) => {
    const newUrls = [...formData.youtubeUrls];
    newUrls[index] = value;
    setFormData((prev) => ({ ...prev, youtubeUrls: newUrls }));
  };

  const addYoutubeUrl = () => {
    setFormData((prev) => ({
      ...prev,
      youtubeUrls: [...prev.youtubeUrls, ""],
    }));
  };

  const removeYoutubeUrl = (index) => {
    const newUrls = formData.youtubeUrls.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, youtubeUrls: newUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Filtrar URLs vacías
      const filteredUrls = formData.youtubeUrls.filter(
        (url) => url.trim() !== ""
      );

      const courseData = {
        ...formData,
        youtubeUrls: filteredUrls,
        instructorId: parseInt(formData.instructorId),
        categoryId: parseInt(formData.categoryId),
        subcategoryId: parseInt(formData.subcategoryId),
        price: parseFloat(formData.price),
        estimatedHours: parseInt(formData.estimatedHours),
      };

      const response = await api.post("/api/courses", courseData);

      if (response.status === 201) {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          title: "",
          description: "",
          shortDescription: "",
          instructorId: "",
          categoryId: "",
          subcategoryId: "",
          youtubeUrls: [""],
          thumbnailUrl: "",
          price: 0,
          isPremium: false,
          isPublished: false,
          isActive: true,
          estimatedHours: 1,
        });

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/admin/cursos");
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError(err.response?.data?.message || "Error al crear el curso");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/cursos");
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Nuevo Curso
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Crear un nuevo curso en la plataforma
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver

          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Curso creado exitosamente
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  El curso ha sido creado correctamente. Redirigiendo a la lista
                  de cursos...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al crear curso
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Información Básica
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Título */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700">
                    Título del Curso *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      maxLength="200"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Título del curso"
                    />
                  </div>
                </div>

                {/* Descripción Corta */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="shortDescription"
                    className="block text-sm font-medium text-gray-700">
                    Descripción Corta
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="shortDescription"
                      id="shortDescription"
                      rows={3}
                      maxLength="255"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Breve descripción del curso"
                    />
                  </div>
                </div>

                {/* Descripción Completa */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700">
                    Descripción Completa *
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="description"
                      id="description"
                      rows={4}
                      required
                      maxLength="1000"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="Descripción detallada del curso"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración del Curso */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Configuración del Curso
              </h3>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Instructor */}
                <div>
                  <label
                    htmlFor="instructorId"
                    className="block text-sm font-medium text-gray-700">
                    Instructor *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="instructorId"
                      id="instructorId"
                      required
                      value={formData.instructorId}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                      <option value="">Seleccionar instructor</option>
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.userName} {instructor.lastName} (
                          {instructor.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm font-medium text-gray-700">
                    Categoría *
                  </label>
                  <div className="mt-1">
                    <select
                      name="categoryId"
                      id="categoryId"
                      required
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subcategoría */}
                <div>
                  <label
                    htmlFor="subcategoryId"
                    className="block text-sm font-medium text-gray-700">
                    Subcategoría *
                  </label>
                  <div className="mt-1">
                    <select
                      name="subcategoryId"
                      id="subcategoryId"
                      required
                      value={formData.subcategoryId}
                      onChange={handleInputChange}
                      disabled={!formData.categoryId}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-100">
                      <option value="">Seleccionar subcategoría</option>
                      {subcategories.map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700">
                    Precio *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Horas Estimadas */}
                <div>
                  <label
                    htmlFor="estimatedHours"
                    className="block text-sm font-medium text-gray-700">
                    Horas Estimadas
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="estimatedHours"
                      id="estimatedHours"
                      min="1"
                      max="1000"
                      value={formData.estimatedHours}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Thumbnail URL */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="thumbnailUrl"
                    className="block text-sm font-medium text-gray-700">
                    URL de Imagen
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      name="thumbnailUrl"
                      id="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* URLs de YouTube */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Videos de YouTube
              </h3>

              {formData.youtubeUrls.map((url, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) =>
                        handleYoutubeUrlChange(index, e.target.value)
                      }
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  {formData.youtubeUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeYoutubeUrl(index)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addYoutubeUrl}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Link className="w-4 h-4 mr-2" />
                Agregar Video
              </button>
            </div>

            {/* Opciones */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Opciones</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPremium"
                    id="isPremium"
                    checked={formData.isPremium}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPremium"
                    className="ml-2 block text-sm text-gray-900">
                    Curso Premium
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isPublished"
                    className="ml-2 block text-sm text-gray-900">
                    Publicar inmediatamente
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900">
                    Curso activo
                  </label>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Curso
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewCoursePage;

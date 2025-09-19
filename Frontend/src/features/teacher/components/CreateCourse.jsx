import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCourse,
  getCourseById,
  updateCourse,
} from "@/services/courseService";
import { useAuth } from "@/contexts/AuthContext";
import { uploadCourseThumbnail } from "@/services/uploadService";
import { toast } from "react-toastify";
import {
  PlusIcon,
  ArrowLeftIcon,
  TrashIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PencilIcon,
  EyeIcon,
  PlayIcon,
  ClockIcon,
  BookOpenIcon,
  StarIcon,
  UsersIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { YoutubePlayer } from "@/shared/hooks/useYoutubePlayer";

const CreateCourse = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [activeModule, setActiveModule] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    category: "",
    price: 0.0,
    level: "beginner",
    thumbnailUrl: null,
    preview: null,
    instructorId: user.id, // Nombre del profesor actual
    rating: 0,
    totalStudents: 0,
    estimatedHours: 1,
    isPremium: true,
    modules: [
      {
        id: Date.now(),
        title: "Módulo 1: Introducción",
        description: "",
        lessons: [
          {
            id: Date.now() + 1,
            title: "Bienvenida al curso",
            type: "video",
            youtubeUrls: [""],
            duration: 0,
            resources: [],
            completed: false,
          },
        ],
      },
    ],
  });

  // Cargar datos del curso si estamos en modo edición
  useEffect(() => {
    const fetchCourse = async () => {
      if (!isEditing || !id) return;

      try {
        const courseData = await getCourseById(id);
        setFormData({
          ...courseData,
          // Asegurar que los módulos y lecciones tengan los campos requeridos
          modules:
            courseData.modules?.map((module) => ({
              ...module,
              lessons:
                module.lessons?.map((lesson) => ({
                  ...lesson,
                  youtubeUrls: lesson.youtubeUrls || [],
                  resources: lesson.resources || [],
                  completed: false,
                })) || [],
            })) || [],
        });
      } catch (error) {
        console.error("Error al cargar el curso:", error);
        toast.error("Error al cargar el curso. Por favor, inténtalo de nuevo.");
      }
    };

    fetchCourse();
  }, [isEditing, id]);

  // Manejo de carga de imagen y previsualización (versión develop)
  // Lógica de develop: previsualización y almacenamiento temporal del archivo
  const [imageFile, setImageFile] = useState(null);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          preview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Debug: Verificar usuario actual
      console.log("=== DEBUG USUARIO ACTUAL ===");
      console.log("Usuario completo:", user);
      console.log("Rol del usuario:", user?.role);
      console.log("ID del usuario:", user?.id);
      console.log("Token desde localStorage:", localStorage.getItem("token"));

      // Verificar que el usuario tenga permisos
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
        console.error("Rol inválido para crear cursos:", user.role);
        throw new Error(
          `No tienes permisos para crear cursos. Tu rol actual es: ${user.role}. Necesitas rol de INSTRUCTOR o ADMIN.`
        );
      }

      console.log("✅ Usuario tiene permisos para crear cursos");

      // Extraer URLs de YouTube de los módulos/lecciones
      const youtubeUrls = [];
      formData.modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
          if (lesson.youtubeUrl && lesson.youtubeUrl.trim()) {
            // Limpiar URL de YouTube para que coincida con el regex del backend
            let cleanUrl = lesson.youtubeUrl.trim();

            // Si contiene parámetros adicionales, extraer solo el ID del video
            const youtubeMatch = cleanUrl.match(
              /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
            );
            if (youtubeMatch) {
              cleanUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
            }

            console.log("URL original:", lesson.youtubeUrl);
            console.log("URL limpia:", cleanUrl);
            youtubeUrls.push(cleanUrl);
          }
        });
      });

      // Calcular horas estimadas basándose en el número de videos
      const calculatedHours = Math.max(1, Math.ceil(youtubeUrls.length * 0.5)); // 30 min por video como estimación

      // Mapeo de categorías
      const categoryMap = {
        programming: { categoryId: 1, subcategoryId: 1 },
        design: { categoryId: 2, subcategoryId: 2 },
        business: { categoryId: 3, subcategoryId: 3 },
        marketing: { categoryId: 4, subcategoryId: 4 },
        photography: { categoryId: 5, subcategoryId: 5 },
        music: { categoryId: 6, subcategoryId: 6 },
      };

      const selectedCategory = categoryMap[formData.category] || {
        categoryId: 1,
        subcategoryId: 1,
      };

      // Subir imagen si hay archivo nuevo
      let thumbnailUrl = formData.thumbnailUrl;
      if (imageFile) {
        thumbnailUrl = await uploadCourseThumbnail(imageFile);
      }

      // Datos según formato de CourseCreateDto (solo URL pública)
      const courseData = {
        title: formData.title,
        description: formData.description,
        shortDescription:
          formData.description.length > 255
            ? formData.description.substring(0, 252) + "..."
            : formData.description,
        instructorId: user?.id || 1, // Usar ID del usuario autenticado
        categoryId: selectedCategory.categoryId,
        subcategoryId: selectedCategory.subcategoryId,
        youtubeUrls: youtubeUrls.length > 0 ? youtubeUrls : [], // Asegurar que sea un array
        thumbnailUrl, // Solo la URL pública
        price: parseFloat(formData.price) || 0.0, // Asegurar que sea número decimal
        isPremium:
          formData.isPremium !== undefined
            ? formData.isPremium
            : parseFloat(formData.price) > 0,
        isPublished: false, // Por defecto como borrador
        isActive: true,
        estimatedHours: parseFloat(formData.estimatedHours) || calculatedHours, // Usar valor del formulario o calcular automáticamente
      };

      console.log("=== DATOS DE VALIDACIÓN ===");
      console.log("Usuario completo:", user);
      console.log("ID del instructor:", user?.id);
      console.log("Rol del usuario:", user?.role);
      console.log("Email del usuario:", user?.email);
      console.log("=== DATOS DEL CURSO A ENVIAR ===");

      console.log("courseData:", JSON.stringify(courseData, null, 2));
      console.log("=== VALIDACIONES ===");
      console.log(
        "Title valid:",
        !!courseData.title && courseData.title.length <= 200
      );
      console.log(
        "Description valid:",
        !!courseData.description && courseData.description.length <= 1000
      );
      console.log(
        "InstructorId valid:",
        !!courseData.instructorId && typeof courseData.instructorId === "number"
      );
      console.log(
        "CategoryId valid:",
        !!courseData.categoryId && typeof courseData.categoryId === "number"
      );
      console.log(
        "SubcategoryId valid:",
        !!courseData.subcategoryId &&
          typeof courseData.subcategoryId === "number"
      );
      console.log(
        "Price valid:",
        typeof courseData.price === "number" && courseData.price >= 0
      );
      console.log(
        "EstimatedHours valid:",
        typeof courseData.estimatedHours === "number" &&
          courseData.estimatedHours >= 1
      );
      console.log("YouTube URLs:", courseData.youtubeUrls);
      console.log(
        "YouTube URLs válidas:",
        courseData.youtubeUrls.every((url) =>
          /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+$/.test(
            url
          )
        )
      );
      console.log("ThumbnailUrl:", courseData.thumbnailUrl);

      // Validaciones adicionales antes de enviar
      if (!courseData.title || courseData.title.length > 200) {
        throw new Error(
          "El título es requerido y debe tener máximo 200 caracteres"
        );
      }
      if (!courseData.description || courseData.description.length > 1000) {
        throw new Error(
          "La descripción es requerida y debe tener máximo 1000 caracteres"
        );
      }
      if (
        courseData.shortDescription &&
        courseData.shortDescription.length > 255
      ) {
        throw new Error(
          "La descripción corta debe tener máximo 255 caracteres"
        );
      }
      if (
        !courseData.instructorId ||
        typeof courseData.instructorId !== "number"
      ) {
        throw new Error("ID del instructor inválido");
      }
      if (!courseData.categoryId || typeof courseData.categoryId !== "number") {
        throw new Error("ID de categoría inválido");
      }
      if (
        !courseData.subcategoryId ||
        typeof courseData.subcategoryId !== "number"
      ) {
        throw new Error("ID de subcategoría inválido");
      }
      if (typeof courseData.price !== "number" || courseData.price < 0) {
        throw new Error("El precio debe ser un número mayor o igual a 0");
      }
      if (
        typeof courseData.estimatedHours !== "number" ||
        courseData.estimatedHours < 1 ||
        courseData.estimatedHours > 1000
      ) {
        throw new Error(
          "Las horas estimadas deben ser un número entre 1 y 1000"
        );
      }
      if (typeof courseData.isPremium !== "boolean") {
        throw new Error("El tipo de curso (premium) debe ser un booleano");
      }

      console.log("✅ Todas las validaciones pasaron");

      // Llamada al servicio
      if (isEditing && id) {
        await updateCourse(id, courseData);
        toast.success("¡Curso actualizado exitosamente!");
      } else {
        await createCourse(courseData);
        toast.success("¡Curso creado exitosamente!");
      }

      // Redirigir después de guardar
      navigate("/teacher/courses");
    } catch (error) {
      console.error("Error al guardar el curso:", error);
      toast.error(error.message || "Ocurrió un error al guardar el curso");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular estadísticas del curso
  const getTotalLessons = () => {
    return (
      formData.modules?.reduce(
        (total, module) => total + (module.lessons?.length || 0),
        0
      ) || 0
    );
  };

  const getTotalDuration = () => {
    return (
      formData.modules?.reduce(
        (total, module) =>
          total +
          (module.lessons?.reduce(
            (moduleTotal, lesson) =>
              moduleTotal + (parseInt(lesson.duration) || 0),
            0
          ) || 0),
        0
      ) || 0
    );
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: `Módulo ${formData.modules.length + 1}`,
      description: "",
      lessons: [],
    };
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
    setActiveModule(formData.modules.length);
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
    }));
  };

  const removeModule = (index) => {
    if (formData.modules.length === 1) return; // No eliminar el último módulo
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
    }));
    if (activeModule >= updatedModules.length) {
      setActiveModule(updatedModules.length - 1);
    }
  };

  const addLesson = (moduleIndex, type = "video") => {
    const newLesson = {
      id: Date.now(),
      title: type === "video" ? "Nuevo video" : "Nuevo documento",
      type,
      youtubeUrl: "",
      duration: 0,
      description: "",
      orderIndex: formData.modules[moduleIndex].lessons.length + 1,
      isPreview: false,
      content: "",
    };

    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons = [
      ...updatedModules[moduleIndex].lessons,
      newLesson,
    ];

    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
    }));
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons[lessonIndex] = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
    }));
  };

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons = updatedModules[
      moduleIndex
    ].lessons.filter((_, i) => i !== lessonIndex);

    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
    }));
  };




  // Helper function to extract YouTube video ID
  const youtubeUrls = [];
  formData.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      if (
        lesson.type === "video" &&
        lesson.youtubeUrl &&
        lesson.youtubeUrl.trim()
      ) {
        // Limpiar URL de YouTube para que coincida con el regex del backend
        let cleanUrl = lesson.youtubeUrl.trim();

        // Si contiene parámetros adicionales, extraer solo el ID del video
        const youtubeMatch = cleanUrl.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
        );
        if (youtubeMatch) {
          cleanUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
        }

        console.log("URL original:", lesson.youtubeUrl);
        console.log("URL limpia:", cleanUrl);
        youtubeUrls.push(cleanUrl);
      }
    });
  });

  // Helper function to get YouTube embed URL
  const getYoutubeEmbedUrl = (url) => {
    const videoId = youtubeUrls.find((u) => u === url);
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
      : "";
  };

  // Componente de Vista Previa del Curso
  const CoursePreview = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Vista Previa del Curso</h2>
          <button
            onClick={() => setShowPreview(false)}
            className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Header del curso como lo ve el estudiante */}
          <div className="relative mb-8">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <PlayIcon className="h-16 w-16 text-white opacity-50" />
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
              Vista previa del curso
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información principal */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {formData.title || "Título del curso"}
              </h1>

              <p className="text-gray-600 mb-6">
                {formData.description ||
                  "Descripción del curso aparecerá aquí..."}
              </p>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">
                    {formData.rating || "Nuevo"}
                  </span>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                  <span className="ml-1">
                    {formData.totalStudents || 0} estudiantes
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span className="ml-1">{getTotalDuration()} min total</span>
                </div>
              </div>

              {/* Contenido del curso */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Contenido del curso
                </h3>
                <div className="space-y-4">
                  {formData.modules.map((module) => (
                    <div key={module.id} className="border rounded-lg">
                      <div className="p-4 bg-gray-50 border-b">
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.lessons.length} lecciones •{" "}
                          {module.lessons.reduce(
                            (total, lesson) => total + (lesson.duration || 0),
                            0
                          )}{" "}
                          min
                        </p>
                      </div>
                      <div className="p-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              {lesson.type === "video" ? (
                                <PlayIcon className="h-4 w-4 text-gray-400 mr-3" />
                              ) : (
                                <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-3" />
                              )}
                              <span className="text-sm">{lesson.title}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {lesson.duration || 0} min
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar de compra */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 border rounded-lg p-6 bg-white shadow-sm">
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  ${formData.price || "0.00"}
                </div>

                <button className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 mb-3">
                  Inscribirse al curso
                </button>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <BookOpenIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{getTotalLessons()} lecciones</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>{getTotalDuration()} minutos de contenido</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Acceso de por vida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente de pasos de creación
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}>
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentStep > step ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/teacher/courses")}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a mis cursos
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Editar Curso" : "Crear Nuevo Curso"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Actualiza la información de tu curso."
                : "Crea un curso atractivo que los estudiantes amarán."}
            </p>
          </div>

          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <EyeIcon className="h-4 w-4 mr-2" />
            Vista Previa
          </button>
        </div>
      </div>

      <StepIndicator />

      {/* Contenido basado en el paso actual */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-6">
            Paso 1: Información Básica
          </h2>

          {/* Imagen del curso mejorada */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Imagen del curso
            </label>
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                {formData.preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.preview}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg font-medium">
                        Cambiar imagen
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                    <PlusIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Sube la imagen de tu curso
                    </p>
                    <p className="text-sm text-gray-500">
                      Recomendado: 1280x720px, formato JPG o PNG
                    </p>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Título del curso */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Título del curso *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  placeholder="Ej: Introducción a la Programación en Python"
                  value={formData.title}
                  onChange={handleChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {formData.title.length}/100 caracteres
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del curso *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="¿De qué trata tu curso? Describe los temas que cubrirás y qué aprenderán los estudiantes..."
                  value={formData.description}
                  onChange={handleChange}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Mínimo 200 caracteres ({formData.description.length}/200)
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Categoría y Nivel */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.category}
                    onChange={handleChange}>
                    <option value="">Selecciona una categoría</option>
                    <option value="programming">💻 Programación</option>
                    <option value="design">🎨 Diseño</option>
                    <option value="business">💼 Negocios</option>
                    <option value="marketing">📈 Marketing</option>
                    <option value="photography">📸 Fotografía</option>
                    <option value="music">🎵 Música</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="level"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel del curso
                  </label>
                  <select
                    id="level"
                    name="level"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.level}
                    onChange={handleChange}>
                    <option value="beginner">🟢 Principiante</option>
                    <option value="intermediate">🟡 Intermedio</option>
                    <option value="advanced">🔴 Avanzado</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-lg">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-gray-700 mb-2">
              Descripción corta
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={3}
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Una descripción breve del curso (máximo 100 caracteres)"
              value={formData.shortDescription}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">
              {formData.shortDescription.length}/100 caracteres
            </p>
          </div>

          <div>
            <label
              htmlFor="estimatedHours"
              className="block text-sm font-medium text-gray-700 mb-2">
              Horas estimadas del curso
            </label>
            <input
              type="number"
              name="estimatedHours"
              id="estimatedHours"
              min="1"
              max="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ej: 20"
              value={formData.estimatedHours}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">
              Duración estimada en horas (1-1000)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de curso
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="premium"
                  name="isPremium"
                  value="true"
                  checked={formData.isPremium === true}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPremium: e.target.value === "true",
                    }))
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="premium" className="ml-2 text-sm text-gray-700">
                  💎 Premium (de pago)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="free"
                  name="isPremium"
                  value="false"
                  checked={formData.isPremium === false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPremium: e.target.value === "true",
                    }))
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="free" className="ml-2 text-sm text-gray-700">
                  🆓 Gratuito
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={
                !formData.title ||
                !formData.description ||
                formData.description.length < 200 ||
                !formData.category ||
                !formData.isPremium ||
                !formData.shortDescription ||
                formData.shortDescription.length < 100 ||
                !formData.estimatedHours ||
                formData.estimatedHours < 1 ||
                !formData.estimatedHours > 1000
              }
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Continuar al Paso 2
            </button>
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-6">
            Paso 2: Estructura del Curso
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de módulos */}
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  Módulos del Curso
                </h3>
                <button
                  type="button"
                  onClick={addModule}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Agregar
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {formData.modules.map((module, moduleIndex) => (
                  <div
                    key={module.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      activeModule === moduleIndex
                        ? "border-indigo-500 bg-indigo-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveModule(moduleIndex)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {module.title || `Módulo ${moduleIndex + 1}`}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {module.lessons.length} lección
                          {module.lessons.length !== 1 ? "es" : ""}
                        </p>
                      </div>
                      {formData.modules.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeModule(moduleIndex);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editor del módulo activo */}
            <div className="lg:col-span-2">
              {formData.modules[activeModule] && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del módulo
                    </label>
                    <input
                      type="text"
                      value={formData.modules[activeModule].title}
                      onChange={(e) =>
                        updateModule(activeModule, "title", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ej: Módulo 1: Introducción al curso"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del módulo
                    </label>
                    <textarea
                      value={formData.modules[activeModule].description}
                      onChange={(e) =>
                        updateModule(
                          activeModule,
                          "description",
                          e.target.value
                        )
                      }
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe los objetivos y contenido de este módulo"
                    />
                  </div>

                  {/* Lecciones */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">Lecciones</h4>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => addLesson(activeModule, "video")}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                          <VideoCameraIcon className="h-4 w-4 mr-1" />
                          Video
                        </button>
                        <button
                          type="button"
                          onClick={() => addLesson(activeModule, "document")}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          Texto
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {formData.modules[activeModule].lessons.map(
                        (lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) =>
                                  updateLesson(
                                    activeModule,
                                    lessonIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="flex-1 font-medium bg-transparent border-b border-transparent focus:border-gray-300 focus:outline-none mr-2"
                                placeholder="Título de la lección"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeLesson(activeModule, lessonIndex)
                                }
                                className="text-gray-400 hover:text-red-500 p-1">
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>

                            {lesson.type === "video" && (
                              <div className="space-y-4">
                                {/* URL de YouTube */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL de YouTube *
                                  </label>
                                  <input
                                    type="url"
                                    value={lesson.youtubeUrl || ""}
                                    onChange={(e) =>
                                      updateLesson(
                                        activeModule,
                                        lessonIndex,
                                        "youtubeUrl",
                                        e.target.value
                                      )
                                    }
                                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Solo se aceptan URLs de YouTube válidas
                                  </p>
                                </div>

                                {/* Duración del video */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duración (minutos) *
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={lesson.duration || ""}
                                    onChange={(e) =>
                                      updateLesson(
                                        activeModule,
                                        lessonIndex,
                                        "duration",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ej: 10"
                                  />
                                </div>

                                {/* Descripción del video */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción del video
                                  </label>
                                  <textarea
                                    value={lesson.description || ""}
                                    onChange={(e) =>
                                      updateLesson(
                                        activeModule,
                                        lessonIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Describe el contenido de este video..."
                                  />
                                </div>

                                {/* Orden del video */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Orden en el curso
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={lesson.orderIndex || lessonIndex + 1}
                                    onChange={(e) =>
                                      updateLesson(
                                        activeModule,
                                        lessonIndex,
                                        "orderIndex",
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="1"
                                  />
                                </div>

                                {/* Video de vista previa */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    ¿Es video de vista previa?
                                  </label>
                                  <div className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={lesson.isPreview || false}
                                      onChange={(e) =>
                                        updateLesson(
                                          activeModule,
                                          lessonIndex,
                                          "isPreview",
                                          e.target.checked
                                        )
                                      }
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                      Los estudiantes pueden ver este video sin
                                      inscribirse
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}

                            {lesson.type === "document" && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenido del documento
                                  </label>
                                  <textarea
                                    value={lesson.content || ""}
                                    onChange={(e) =>
                                      updateLesson(
                                        activeModule,
                                        lessonIndex,
                                        "content",
                                        e.target.value
                                      )
                                    }
                                    rows="6"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Escribe el contenido del documento aquí..."
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
              Volver al Paso 1
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              disabled={
                formData.modules.length === 0 ||
                formData.modules.every((m) => m.lessons.length === 0)
              }
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Continuar al Paso 3
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold mb-6">
              Paso 3: Revisión y Publicación
            </h2>

            {/* Resumen del curso */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Resumen del Curso
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Título:</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categoría:</span>
                    <span className="font-medium">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nivel:</span>
                    <span className="font-medium">{formData.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <span className="font-medium">${formData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Módulos:</span>
                    <span className="font-medium">
                      {formData.modules.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lecciones totales:</span>
                    <span className="font-medium">{getTotalLessons()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración total:</span>
                    <span className="font-medium">
                      {getTotalDuration()} min
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Vista Previa
                </h3>
                {formData.preview && (
                  <img
                    src={formData.preview}
                    alt="Vista previa del curso"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {formData.description}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Volver al Paso 2
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting
                    ? "Creando curso..."
                    : isEditing
                    ? "Actualizar curso"
                    : "Crear curso"}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Modal de Vista Previa */}
      {showPreview && <CoursePreview />}
    </div>
  );
};

export default React.memo(CreateCourse);

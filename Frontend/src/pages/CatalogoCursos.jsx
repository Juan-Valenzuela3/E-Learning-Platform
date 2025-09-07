import React, { useState } from "react";
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CatalogoCursos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedLevel, setSelectedLevel] = useState("todos");

  const categories = [
    { id: "todos", name: "Todos los cursos" },
    { id: "frontend", name: "Frontend Development" },
    { id: "backend", name: "Backend Development" },
    { id: "fullstack", name: "Full Stack Development" },
    { id: "mobile", name: "Mobile Development" },
    { id: "data", name: "Data Science & AI" },
    { id: "design", name: "UI/UX Design" },
    { id: "devops", name: "DevOps & Cloud" },
  ];

  const levels = [
    { id: "todos", name: "Todos los niveles" },
    { id: "principiante", name: "Principiante" },
    { id: "intermedio", name: "Intermedio" },
    { id: "avanzado", name: "Avanzado" },
  ];

  const cursos = [
    {
      id: 1,
      title: "React desde Cero hasta Avanzado",
      instructor: "Carlos Mendoza",
      category: "frontend",
      level: "intermedio",
      rating: 4.8,
      students: 1247,
      duration: "45h",
      price: 89.99,
      originalPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      tags: ["React", "JavaScript", "Hooks", "Redux"],
      description:
        "Aprende React desde los fundamentos hasta técnicas avanzadas. Construye aplicaciones modernas y escalables.",
    },
    {
      id: 2,
      title: "Node.js y Express para Backend",
      instructor: "Ana García",
      category: "backend",
      level: "intermedio",
      rating: 4.7,
      students: 892,
      duration: "32h",
      price: 79.99,
      originalPrice: 109.99,
      image:
        "https://images.unsplash.com/photo-1555066931-4365d9b73631?w=400&h=250&fit=crop",
      tags: ["Node.js", "Express", "MongoDB", "API"],
      description:
        "Desarrolla APIs robustas y escalables con Node.js y Express. Aprende autenticación, bases de datos y deployment.",
    },
    {
      id: 3,
      title: "Machine Learning con Python",
      instructor: "David Chen",
      category: "data",
      level: "avanzado",
      rating: 4.9,
      students: 567,
      duration: "58h",
      price: 119.99,
      originalPrice: 159.99,
      image:
        "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
      tags: ["Python", "TensorFlow", "Scikit-learn", "Deep Learning"],
      description:
        "Domina el Machine Learning con Python. Implementa algoritmos de IA y crea modelos predictivos avanzados.",
    },
    {
      id: 4,
      title: "Diseño UX/UI Avanzado",
      instructor: "María López",
      category: "design",
      level: "intermedio",
      rating: 4.6,
      students: 734,
      duration: "28h",
      price: 69.99,
      originalPrice: 99.99,
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      tags: ["Figma", "UX Research", "Prototyping", "User Testing"],
      description:
        "Crea experiencias de usuario excepcionales. Aprende investigación, diseño y testing de interfaces.",
    },
    {
      id: 5,
      title: "DevOps con Docker y Kubernetes",
      instructor: "Roberto Silva",
      category: "devops",
      level: "avanzado",
      rating: 4.8,
      students: 445,
      duration: "38h",
      price: 94.99,
      originalPrice: 134.99,
      image:
        "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
      tags: ["Docker", "Kubernetes", "CI/CD", "AWS"],
      description:
        "Automatiza el deployment y escalado de aplicaciones. Domina Docker, Kubernetes y pipelines de CI/CD.",
    },
    {
      id: 6,
      title: "Flutter para Desarrollo Móvil",
      instructor: "Laura Torres",
      category: "mobile",
      level: "principiante",
      rating: 4.5,
      students: 623,
      duration: "35h",
      price: 74.99,
      originalPrice: 104.99,
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      tags: ["Flutter", "Dart", "Mobile", "Cross-platform"],
      description:
        "Desarrolla apps móviles nativas para iOS y Android con Flutter. Una base de código, dos plataformas.",
    },
  ];

  const filteredCursos = cursos.filter((curso) => {
    const matchesSearch =
      curso.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "todos" || curso.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "todos" || curso.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case "principiante":
        return "bg-green-100 text-green-800";
      case "intermedio":
        return "bg-yellow-100 text-yellow-800";
      case "avanzado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "frontend":
        return "bg-blue-100 text-blue-800";
      case "backend":
        return "bg-purple-100 text-purple-800";
      case "fullstack":
        return "bg-indigo-100 text-indigo-800";
      case "mobile":
        return "bg-pink-100 text-pink-800";
      case "data":
        return "bg-green-100 text-green-800";
      case "design":
        return "bg-orange-100 text-orange-800";
      case "devops":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Catálogo de Cursos
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total de cursos</p>
              <p className="text-2xl font-bold text-red-500">
                {filteredCursos.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por categoría */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Filtro por nivel */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent">
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>

            {/* Botón de limpiar filtros */}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("todos");
                setSelectedLevel("todos");
              }}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              {/* Imagen del curso */}
              <div className="relative">
                <img
                  src={curso.image}
                  alt={curso.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(
                      curso.level
                    )}`}>
                    {levels.find((l) => l.id === curso.level)?.name}
                  </span>
                </div>
                {curso.originalPrice > curso.price && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      -
                      {Math.round(
                        ((curso.originalPrice - curso.price) /
                          curso.originalPrice) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>

              {/* Contenido del curso */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      curso.category
                    )}`}>
                    {categories.find((c) => c.id === curso.category)?.name}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-medium text-gray-700">
                      {curso.rating}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {curso.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {curso.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="mr-4 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {curso.duration}
                  </span>
                  <span className="mr-4 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {curso.students.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {curso.instructor}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {curso.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Precio y botón */}
                <div className="flex items-center justify-between">
                  <div>
                    {curso.originalPrice > curso.price ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-red-500">
                          ${curso.price}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          ${curso.originalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">
                        ${curso.price}
                      </span>
                    )}
                  </div>
                  <button className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">
                    Ver curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {filteredCursos.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron cursos
            </h3>
            <p className="text-gray-500">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

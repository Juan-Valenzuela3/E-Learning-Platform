import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";

export default function TestimonioCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sawyer",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sawyer",
      course: "React-Avanzado",
      role: "Frontend Developer en Google",
      content:
        "Los cursos son increíbles. La metodología y la calidad del contenido superaron mis expectativas. Conseguí mi trabajo soñado.",
      rating: 5,
    },
    {
      name: "María",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maria",
      course: "Machine Learning",
      role: "Data Scientist en Amazon",
      content:
        "Gracias a esta plataforma pude especializarme en IA. Los proyectos prácticos me dieron la experiencia que necesitaba para mi carrera.",
      rating: 5,
    },
    {
      name: "Carlos",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Carlos",
      course: "Full Stack Development",
      role: "Senior Developer en Microsoft",
      content:
        "La combinación de teoría y práctica es perfecta. En 6 meses pasé de principiante a conseguir un trabajo en una empresa top.",
      rating: 5,
    },
    {
      name: "Ana",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ana",
      course: "UI/UX Design",
      role: "Product Designer en Apple",
      content:
        "El enfoque en proyectos reales me permitió construir un portafolio impresionante. Ahora diseño para millones de usuarios.",
      rating: 5,
    },
    {
      name: "David",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=David",
      course: "DevOps Engineering",
      role: "DevOps Engineer en Netflix",
      content:
        "Los instructores son expertos reales de la industria. Aprendí tecnologías que realmente se usan en empresas grandes.",
      rating: 5,
    },
  ];

  // Carrusel automático cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonios" className="py-20 bg-gradient-to-br from-gray-50 to-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Historias de éxito reales
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estudiantes que transformaron sus carreras y ahora trabajan en las
            mejores empresas del mundo
          </p>
        </div>

        {/* Carrusel Automático de Testimonios */}
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonio Principal con Transición */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 transform transition-all duration-1000 ease-in-out">
            <div className="flex items-center mb-6">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                className="w-20 h-20 rounded-full mr-6 border-4 border-red-100 shadow-lg"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-xl">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-600 text-base">
                  {testimonials[currentIndex].role}
                </p>
                <p className="text-red-500 text-sm font-medium mt-1">
                  {testimonials[currentIndex].course}
                </p>
              </div>
            </div>

            <div className="flex mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-6 h-6 text-yellow-500 fill-current"
                />
              ))}
            </div>

            <p className="text-gray-700 italic leading-relaxed text-lg">
              "{testimonials[currentIndex].content}"
            </p>
          </div>

          {/* Indicadores de Progreso */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentIndex
                    ? "bg-red-500 scale-125"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Grid con todo los caso de exitos
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Todos nuestros estudiantes exitosos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                  index === currentIndex ? "border-red-500" : "border-gray-100"
                }`}>
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 border-2 border-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-red-500 text-xs font-medium">
                      {testimonial.course}
                    </p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 italic text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
        */}
      </div>
    </section>
  );
}

import { GraduationCap, BookOpen, Laptop, MessageSquare, Award, CheckCircle } from 'lucide-react';

// Array de datos para los pasos del proceso
const steps = [
  {
    id: 1,
    title: "Regístrate en la Plataforma",
    description: "Crea tu cuenta en minutos, ya sea como estudiante para aprender o como instructor para enseñar. Solo necesitas un correo electrónico y una contraseña.",
    icon: GraduationCap,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    title: "Explora y Elige tu Camino",
    description: "Navega por nuestro extenso catálogo de cursos de diversas áreas. Encuentra el que mejor se adapte a tus intereses y metas de aprendizaje.",
    icon: BookOpen,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    title: "Aprende a tu Ritmo",
    description: "Accede a lecciones interactivas, materiales descargables y ejercicios prácticos. Aprende cuando y donde quieras desde cualquier dispositivo.",
    icon: Laptop,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    title: "Interactúa y Colabora",
    description: "Conéctate con una comunidad de estudiantes e instructores. Participa en foros, haz preguntas y comparte tus conocimientos para un aprendizaje colaborativo.",
    icon: MessageSquare,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 5,
    title: "Obtén tu Certificación",
    description: "Al completar exitosamente un curso, obtén un certificado oficial que valida tus nuevas habilidades y te permite destacarte profesionalmente.",
    icon: Award,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
];

// Componente para un solo paso, mejorando la reusabilidad
const Step = ({ step, isEven }) => (
  <div className={`relative md:flex justify-center mb-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
    <div className={`md:w-5/12 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className={`flex items-center justify-center mb-4 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} ${step.iconColor}`}>
            <step.icon className="w-8 h-8" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.id}. {step.title}</h3>
        <p className="text-gray-600">
          {step.description}
        </p>
      </div>
    </div>
    <div className="hidden md:flex items-center justify-center w-2/12 px-4">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">{step.id}</div>
    </div>
    <div className="md:w-5/12"></div>
  </div>
);

export default function ComoFunciona() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Cómo Funciona Nuestra Plataforma
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Aprende o enseña a tu propio ritmo.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-0 left-1/2 w-1 h-full bg-blue-500 transform -translate-x-1/2"></div>
            
            {/* Renderizado dinámico de los pasos */}
            {steps.map((step, index) => (
              <Step key={step.id} step={step} isEven={index % 2 === 0} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white rounded-lg shadow-lg p-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
          </h2>
          <p className="mt-4 text-xl leading-6 text-gray-600">
            Únete a una comunidad de estudiantes e instructores.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="rounded-md shadow">
              <a
                href="/authentication"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-100 hover:bg-primary-600 md:py-4 md:text-lg md:px-10"
              >
                Comenzar Ahora
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
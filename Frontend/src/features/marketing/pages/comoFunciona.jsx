import { GraduationCap, BookOpen, Laptop, MessageSquare, Award, CheckCircle } from 'lucide-react';

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
            Aprende a tu propio ritmo con nuestra plataforma de aprendizaje en línea
          </p>
        </div>

        {/* Steps */}
        <div className="mt-10">
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-0 left-1/2 w-1 h-full bg-blue-500 transform -translate-x-1/2"></div>
            
            {/* Step 1 */}
            <div className="relative md:flex justify-center mb-16">
              <div className="md:w-5/12 md:pr-12 md:text-right">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center md:justify-end mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">1. Regístrate</h3>
                  <p className="text-gray-600">
                    Crea tu cuenta en minutos. Solo necesitas un correo electrónico y una contraseña.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center w-2/12 px-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">1</div>
              </div>
              <div className="md:w-5/12"></div>
            </div>

            {/* Step 2 */}
            <div className="relative md:flex justify-center mb-16">
              <div className="md:w-5/12"></div>
              <div className="hidden md:flex items-center justify-center w-2/12 px-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">2</div>
              </div>
              <div className="md:w-5/12 md:pl-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">2. Explora los Cursos</h3>
                  <p className="text-gray-600">
                    Navega por nuestro catálogo de cursos y encuentra el que mejor se adapte a tus necesidades de aprendizaje.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative md:flex justify-center mb-16">
              <div className="md:w-5/12 md:pr-12 md:text-right">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center md:justify-end mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600">
                      <Laptop className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">3. Aprende a tu Ritmo</h3>
                  <p className="text-gray-600">
                    Accede a lecciones en video, materiales descargables y ejercicios prácticos cuando quieras y desde cualquier dispositivo.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center w-2/12 px-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">3</div>
              </div>
              <div className="md:w-5/12"></div>
            </div>

            {/* Step 4 */}
            <div className="relative md:flex justify-center mb-16">
              <div className="md:w-5/12"></div>
              <div className="hidden md:flex items-center justify-center w-2/12 px-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">4</div>
              </div>
              <div className="md:w-5/12 md:pl-12">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">4. Interactúa con la Comunidad</h3>
                  <p className="text-gray-600">
                    Participa en foros de discusión, haz preguntas y comparte conocimientos con otros estudiantes.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="relative md:flex justify-center">
              <div className="md:w-5/12 md:pr-12 md:text-right">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center md:justify-end mb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600">
                      <Award className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">5. Obtén tu Certificación</h3>
                  <p className="text-gray-600">
                    Al completar exitosamente un curso, recibe un certificado que podrás compartir en tu perfil profesional.
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center w-2/12 px-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">5</div>
              </div>
              <div className="md:w-5/12"></div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-white rounded-lg shadow-lg p-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
          </h2>
          <p className="mt-4 text-xl leading-6 text-gray-600">
            Únete a miles de estudiantes que ya están aprendiendo con nosotros.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="rounded-md shadow">
              <a
                href="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
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
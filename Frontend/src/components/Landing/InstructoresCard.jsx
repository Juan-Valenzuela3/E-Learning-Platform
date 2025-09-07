import React, {  } from "react";
import {
  Star,
  Users,
  BookOpen,
  Linkedin,
  Twitter,
  X,
  Mail,
  Globe,
} from "lucide-react";

export default function InstuctoresCard() {
  
  //const [selectedInstructor, setSelectedInstructor] = useState(null);

  const instructorInfo = [
    {
      name: "Carlos Mendoza",
      especialidad: "Full Stack Developer",
      descripcion:
        "Experto en HTML, CSS y JavaScript con más de 10 años enseñando programación.",
      imgprofile: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.9,
      students: 1250,
      courses: 8,
      experience: "10+ años",
      skills: ["React", "Node.js", "Python", "AWS"],
      bio: "Carlos es un desarrollador Full Stack apasionado por la enseñanza. Ha trabajado en empresas como Google y Microsoft, y ha ayudado a más de 1000 estudiantes a convertirse en desarrolladores profesionales.",
      education: "Ingeniería en Sistemas - Universidad de Buenos Aires",
      certifications: [
        "AWS Certified Developer",
        "Google Cloud Professional",
        "Microsoft Certified",
      ],
      social: {
        linkedin: "https://linkedin.com/in/carlos-mendoza",
        twitter: "https://twitter.com/carlosdev",
        website: "https://carlosmendoza.dev",
      },
    },
    {
      name: "Ana García",
      especialidad: "Data Scientist",
      descripcion:
        "Especialista en Machine Learning y análisis de datos con experiencia en empresas Fortune 500.",
      imgprofile: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.8,
      students: 890,
      courses: 6,
      experience: "8+ años",
      skills: ["Python", "TensorFlow", "SQL", "Tableau"],
      bio: "Ana es una científica de datos con amplia experiencia en el sector financiero y tecnológico. Ha liderado proyectos de IA en empresas como Amazon y ha publicado más de 20 papers científicos.",
      education: "Maestría en Ciencias de Datos - Stanford University",
      certifications: [
        "TensorFlow Developer",
        "Data Science Professional",
        "Tableau Specialist",
      ],
      social: {
        linkedin: "https://linkedin.com/in/ana-garcia",
        twitter: "https://twitter.com/anadata",
        website: "https://anagarciadata.com",
      },
    },
    {
      name: "María López",
      especialidad: "UI/UX Designer",
      descripcion:
        "Diseñadora creativa con pasión por crear experiencias digitales memorables y accesibles.",
      imgprofile: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.9,
      students: 2100,
      courses: 12,
      experience: "12+ años",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
      bio: "María es una diseñadora UX/UI reconocida internacionalmente. Ha diseñado interfaces para empresas como Apple, Spotify y Airbnb. Su enfoque en la accesibilidad y la experiencia del usuario la ha convertido en una referente en la industria.",
      education: "Diseño Gráfico - Parsons School of Design",
      certifications: [
        "Google UX Design",
        "Adobe Creative Suite",
        "Accessibility Specialist",
      ],
      social: {
        linkedin: "https://linkedin.com/in/maria-lopez",
        twitter: "https://twitter.com/mariadesign",
        website: "https://marialopezdesign.com",
      },
    },
  ];

  return (
    <>
      <section
        id="instructores"
        className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Conoce a nuestros Instructores
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Expertos en cada área listos para guiarte en tu aprendizaje
              <span className="ml-1">🚀</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructorInfo.map((instructor) => (
              <div
                key={instructor.name}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2">
                {/* Header con imagen circular centrada */}
                <div className="relative pt-8 pb-4 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={instructor.imgprofile}
                        alt={instructor.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {instructor.experience}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6">
                  {/* Nombre y especialidad */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-500 transition-colors">
                      {instructor.name}
                    </h3>
                    <p className="text-red-500 font-semibold text-sm">
                      {instructor.especialidad}
                    </p>
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-600 text-center mb-6 leading-relaxed">
                    {instructor.descripcion}
                  </p>

                  {/* Estadísticas
                  <div className="flex items-center justify-center space-x-6 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-bold text-gray-900">
                          {instructor.rating}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Rating</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-blue-500 mr-1" />
                        <span className="text-sm font-bold text-gray-900">
                          {instructor.students.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Estudiantes</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <BookOpen className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-bold text-gray-900">
                          {instructor.courses}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Cursos</span>
                    </div>
                  </div>
                  */}

                  {/* Habilidades
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                      Habilidades principales
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {instructor.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-100 hover:text-red-700 transition-colors">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botón de acción
                  <div className="text-center">
                    <button
                      className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors group-hover:scale-105 shadow-lg hover:shadow-xl"
                      onClick={() => setSelectedInstructor(instructor)}>
                      Ver perfil completo
                    </button>
                  </div>
                  */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal del Instructor
      {selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal
            <div className="relative p-6 border-b border-gray-200">
              <button
                onClick={() => setSelectedInstructor(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-4">
                <img
                  src={selectedInstructor.imgprofile}
                  alt={selectedInstructor.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-red-100"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedInstructor.name}
                  </h2>
                  <p className="text-red-500 font-semibold">
                    {selectedInstructor.especialidad}
                  </p>
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="text-sm font-bold">
                      {selectedInstructor.rating}
                    </span>
                    <span className="text-gray-500 ml-2">
                      • {selectedInstructor.experience} de experiencia
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del Modal
            <div className="p-6 space-y-6">
              {/* Biografía
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Biografía
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedInstructor.bio}
                </p>
              </div>

              {/* Educación
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Educación
                </h3>
                <p className="text-gray-600">{selectedInstructor.education}</p>
              </div>

              {/* Certificaciones
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Certificaciones
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInstructor.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Habilidades
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Habilidades
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInstructor.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Estadísticas
              <div className="grid grid-cols-3 gap-4 py-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {selectedInstructor.students.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Estudiantes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {selectedInstructor.courses}
                  </div>
                  <div className="text-sm text-gray-600">Cursos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {selectedInstructor.rating}
                  </div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* Enlaces Sociales
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Conecta con {selectedInstructor.name}
                </h3>
                <div className="flex space-x-4">
                  <a
                    href={selectedInstructor.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={selectedInstructor.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-500 transition-colors">
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </a>
                  <a
                    href={selectedInstructor.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors">
                    <Globe className="w-5 h-5" />
                    <span>Sitio Web</span>
                  </a>
                </div>
              </div>
            </div>


            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setSelectedInstructor(null)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Cerrar
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">
                  Ver cursos de {selectedInstructor.name}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}*/}
    </>
  );
}

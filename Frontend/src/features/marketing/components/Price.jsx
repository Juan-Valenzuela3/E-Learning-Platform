import React from "react";
import{ X,CheckCircle } from "lucide-react"


export default function Price(){
  return(
    <section id="precios" className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Pago <span className="text-red-500">por curso</span>, no por suscripción
        </h2>
        <p className="text-xl text-gray-600">
          Invierte solo en lo que realmente necesitas aprender
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 relative">
          <div className="absolute top-4 right-4">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Otras Plataformas
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">$39-99/mes para siempre</span>
            </li>
            <li className="flex items-start">
              <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">Acceso a cursos que no necesitas</span>
            </li>
            <li className="flex items-start">
              <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">Presión por consumir contenido</span>
            </li>
            <li className="flex items-start">
              <X className="w-5 h-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">Pierdes acceso si dejas de pagar</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-red-500 relative shadow-xl">
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              NUESTRO MODELO
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            EduPlatform
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">Pago único por curso</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">Acceso de por vida</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">Elige exactamente qué aprender</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
              <span className="text-gray-600">Sin presión de tiempo</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
  )
}
// src/pages/CentroAyuda.jsx

import React from 'react';
import Acordeon from '@/features/marketing/components/Acordeon';

export default function CentroAyuda() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Centro de Ayuda</h1>
          <p className="text-xl text-gray-600">
            Encuentra respuestas a tus preguntas más frecuentes o contáctanos para obtener ayuda.
          </p>
        </header>
        
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Preguntas Frecuentes</h2>
          
          <Acordeon title="¿Cómo me registro en la plataforma?">
            <p>Para registrarte, haz clic en el botón "Empezar ahora" en la esquina superior derecha. Llena el formulario con tu información y podras de difrutar de la gran variedad de curso que tenemos.</p>
          </Acordeon>
          
          <Acordeon title="¿Cuáles son los métodos de pago aceptados?">
            <p>Aceptamos tarjetas de crédito y débito (Visa, MasterCard), PayPal y transferencias bancarias locales.</p>
          </Acordeon>

          <Acordeon title="¿Puedo acceder a los cursos desde mi móvil?">
            <p>Sí, nuestra plataforma es totalmente adaptable y puedes acceder a todos los cursos desde cualquier dispositivo móvil o tablet sin necesidad de descargar una aplicación.</p>
          </Acordeon>
          
          {/* Puedes agregar más Acordeones aquí */}

        </section>
        
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¿No encontraste lo que buscabas?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Puedes contactarnos directamente para cualquier otra pregunta.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            Ir a la página de Contacto
          </a>
        </section>
      </div>
    </div>
  );
}
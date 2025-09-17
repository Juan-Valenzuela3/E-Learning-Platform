// src/pages/Privacidad.jsx

import React from 'react';

export default function Privacidad() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Política de Privacidad
          </h1>
          <p className="text-gray-500">Última actualización: 14 de septiembre de 2025</p>
        </header>
        
        <section className="text-gray-700 space-y-6">
          <p>
            Tu privacidad es importante para nosotros. Esta política describe cómo
            recopilamos, usamos y protegemos tu información personal cuando usas
            nuestros servicios.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Información que Recopilamos</h2>
          <p>
            Recopilamos la información que nos proporcionas directamente, como tu nombre,
            dirección de correo electrónico y detalles de pago. También recopilamos
            información sobre tu uso del servicio, como los cursos en los que te inscribes y
            el progreso de tus lecciones.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Uso de la Información</h2>
          <p>
            Usamos tu información para operar, mantener y mejorar nuestros servicios. Esto
            incluye procesar transacciones, enviarte notificaciones y personalizar tu
            experiencia de aprendizaje.
          </p>
          
          {/* Añade más secciones para cookies, seguridad, etc. */}
        </section>
      </div>
    </div>
  );
}
// src/pages/TerminosUso.jsx

import React from 'react';

export default function TerminosUso() {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Términos de Uso
          </h1>
          <p className="text-gray-500">Última actualización: 14 de septiembre de 2025</p>
        </header>

        <section className="text-gray-700 space-y-6">
          <p>
            Bienvenido a nuestra plataforma. Al acceder o utilizar nuestros servicios, aceptas
            cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con
            alguna parte de estos términos, por favor no uses nuestros servicios.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">1. Uso del Servicio</h2>
          <p>
            La plataforma y su contenido están destinados únicamente para tu uso personal y no comercial.
            No puedes modificar, copiar, distribuir, transmitir, mostrar, ejecutar,
            reproducir, publicar, licenciar, crear trabajos derivados, transferir o vender
            ninguna información, software, productos o servicios obtenidos de la plataforma.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Propiedad Intelectual</h2>
          <p>
            Todo el contenido, marcas registradas, logotipos y otros materiales
            relacionados con la plataforma son propiedad de [Nombre de tu Empresa] o de sus
            licenciantes. Dichos materiales están protegidos por leyes de derechos de autor y de propiedad
            intelectual.
          </p>

          {/* Puedes añadir más secciones según sea necesario */}
        </section>
      </div>
    </div>
  );
}
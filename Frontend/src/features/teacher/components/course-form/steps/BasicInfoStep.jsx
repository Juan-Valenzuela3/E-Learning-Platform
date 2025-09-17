import React from 'react';
import PropTypes from 'prop-types';

const BasicInfoStep = ({ course, setCourse }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setCourse(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Información básica del curso</h2>
        <p className="text-gray-600 text-sm">Completa la información básica de tu curso para que los estudiantes sepan de qué se trata.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del curso <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Título del curso"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtítulo <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-1">(Aparecerá en la página principal)</span>
          </label>
          <input
            type="text"
            name="subtitle"
            value={course.subtitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Subtítulo atractivo para tu curso"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría principal <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={course.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="">Selecciona una categoría</option>
            <option value="programming">Programación</option>
            <option value="design">Diseño</option>
            <option value="business">Negocios</option>
            <option value="marketing">Marketing</option>
            <option value="lifestyle">Estilo de vida</option>
            <option value="academic">Académico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategoría
          </label>
          <input
            type="text"
            name="subcategory"
            value={course.subcategory}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            placeholder="Ej: Desarrollo Web, Marketing Digital, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nivel de dificultad <span className="text-red-500">*</span>
          </label>
          <select
            name="difficulty"
            value={course.difficulty}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
            <option value="all">Todos los niveles</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Idioma <span className="text-red-500">*</span>
          </label>
          <select
            name="language"
            value={course.language}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            required
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
            <option value="pt">Portugués</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (USD) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="price"
              value={course.price}
              onChange={handlePriceChange}
              min="0"
              step="0.01"
              className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio con descuento (opcional)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="discountPrice"
              value={course.discountPrice}
              onChange={handlePriceChange}
              min="0"
              step="0.01"
              className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción detallada <span className="text-red-500">*</span>
          <span className="text-xs text-gray-500 ml-1">(Puedes usar formato Markdown)</span>
        </label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleInputChange}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          placeholder="Describe el contenido de tu curso..."
          required
        />
      </div>
    </div>
  );
};

BasicInfoStep.propTypes = {
  course: PropTypes.object.isRequired,
  setCourse: PropTypes.func.isRequired
};

export default BasicInfoStep;

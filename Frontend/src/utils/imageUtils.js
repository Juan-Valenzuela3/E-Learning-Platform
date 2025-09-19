/**
 * Utilidades para manejo de imágenes y placeholders
 */

/**
 * Genera un placeholder SVG para imágenes de cursos
 * @param {string} text - Texto a mostrar en el placeholder
 * @param {number} width - Ancho de la imagen
 * @param {number} height - Alto de la imagen
 * @param {string} bgColor - Color de fondo
 * @param {string} textColor - Color del texto
 * @returns {string} - Data URL del SVG
 */
export const generateCoursePlaceholder = (
  text = "Curso",
  width = 400,
  height = 250,
  bgColor = "#f3f4f6",
  textColor = "#6b7280"
) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" dy=".3em">
        ${text}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Genera un placeholder simple para imágenes
 * @param {string} text - Texto a mostrar
 * @param {number} width - Ancho
 * @param {number} height - Alto
 * @returns {string} - Data URL del SVG
 */
export const generateSimplePlaceholder = (
  text = "Sin imagen",
  width = 400,
  height = 200
) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${text}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Maneja el error de carga de imagen y aplica un fallback
 * @param {Event} event - Evento de error de la imagen
 * @param {string} fallbackText - Texto para el fallback
 */
export const handleImageError = (event, fallbackText = "Sin imagen") => {
  event.target.src = generateSimplePlaceholder(fallbackText);
};


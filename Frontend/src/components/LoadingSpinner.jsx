export default function LoadingSpinner({ 
  className = '', 
  size = 'md', 
  text = 'Cargando...',
  fullScreen = false,
  color = 'red' // red, blue, green, yellow, indigo, purple, pink
}) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
    xl: 'h-16 w-16 border-[4px]'
  };

  const colorClasses = {
    red: 'border-red-100 border-t-red-500',
    blue: 'border-blue-100 border-t-blue-500',
    green: 'border-green-100 border-t-green-500',
    yellow: 'border-yellow-100 border-t-yellow-500',
    indigo: 'border-indigo-100 border-t-indigo-500',
    purple: 'border-purple-100 border-t-purple-500',
    pink: 'border-pink-100 border-t-pink-500'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const containerClasses = `
    flex flex-col items-center justify-center gap-3 
    ${fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : ''}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      <div className={`
        animate-spin rounded-full 
        ${sizeClasses[size] || sizeClasses.md}
        ${colorClasses[color] || colorClasses.red}
      `}></div>
      {text && (
        <p className={`${textSizes[size] || textSizes.md} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
}

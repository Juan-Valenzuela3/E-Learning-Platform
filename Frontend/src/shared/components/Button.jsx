import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  loadingText = 'Procesando...',
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-red-500',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500',
    success: 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      ref={ref}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${widthClass}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" color="white" />
          {loadingText}
        </>
      ) : (
        <>
          {startIcon && <span className="mr-2">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-2">{endIcon}</span>}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

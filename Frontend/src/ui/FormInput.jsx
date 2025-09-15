import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormInput = forwardRef(({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  error = false,
  errorMessage = '',
  disabled = false,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  // Cambiar dinámicamente el tipo de input para contraseñas
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-4 text-left relative">
      <label
        htmlFor={name}
        className="block text-gray-700 font-medium mb-2"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none pr-10
            ${error ? 'border-red-500 focus:ring-2 focus:ring-red-400' : 'focus:ring-2 focus:ring-red-400'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          required
          ref={ref}
          {...rest}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;

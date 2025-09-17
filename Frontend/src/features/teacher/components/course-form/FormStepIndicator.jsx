import React from 'react';
import PropTypes from 'prop-types';

const FormStepIndicator = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrent = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <li key={step.id} className="relative flex-1">
              <div className="flex flex-col items-center">
                {/* Línea entre pasos */}
                {index > 0 && (
                  <div 
                    className={`absolute top-4 -left-1/2 w-full h-0.5 ${isCompleted ? 'bg-red-600' : 'bg-gray-200'}`}
                    aria-hidden="true"
                  />
                )}
                
                {/* Círculo del paso */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCurrent
                      ? 'border-red-600 bg-white'
                      : isCompleted
                      ? 'border-red-600 bg-red-600'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
                
                {/* Etiqueta del paso */}
                <span
                  className={`mt-2 text-sm font-medium ${
                    isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

FormStepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  currentStep: PropTypes.number.isRequired
};

export default FormStepIndicator;

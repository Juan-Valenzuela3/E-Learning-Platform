import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';

const FormNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isSubmitting,
  onSaveDraft
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="mt-8 pt-5 border-t border-gray-200 flex justify-between">
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={isSubmitting}
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Anterior
        </button>
      ) : (
        <div />
      )}
      
      <div className="flex space-x-3
      ">
        <button
          type="button"
          onClick={(e) => onSaveDraft(e)}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Guardar borrador
            </>
          )}
        </button>
        
        <button
          type={isLastStep ? 'submit' : 'button'}
          onClick={!isLastStep ? onNext : undefined}
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {isLastStep ? 'Publicando...' : 'Cargando...'}
            </>
          ) : (
            <>
              {isLastStep ? 'Publicar curso' : 'Siguiente'}
              {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

FormNavigation.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onSaveDraft: PropTypes.func.isRequired
};

export default FormNavigation;

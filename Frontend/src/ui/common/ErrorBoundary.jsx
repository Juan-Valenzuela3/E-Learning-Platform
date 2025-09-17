import React, { Component } from 'react';
import { Button } from '@mui/material';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error.message);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              ¡Ups! Algo salió mal
            </h1>
            <p className="mt-2 text-gray-600">
              Lo sentimos, ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.
            </p>
            
            {import.meta.env.DEV && error && (
              <details className="mt-4 p-4 bg-gray-50 rounded-lg text-left text-sm text-gray-600">
                <summary className="font-medium cursor-pointer">Detalles del error</summary>
                <pre className="mt-2 overflow-auto max-h-40 p-2 bg-white rounded border border-gray-200">
                  {error.message || JSON.stringify(error, null, 2)}
                </pre>
              </details>
            )}
    
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="w-full sm:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
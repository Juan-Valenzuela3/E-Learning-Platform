import React, { Component } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            textAlign: 'center',
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
            }}
          >
            <Typography variant="h4" color="error" gutterBottom>
              ¡Ups! Algo salió mal
            </Typography>
            
            <Typography variant="body1" paragraph>
              Lo sentimos, ha ocurrido un error inesperado en la aplicación.
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                component="details"
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: (theme) => theme.palette.grey[100],
                  borderRadius: 1,
                  textAlign: 'left',
                  maxHeight: '200px',
                  overflow: 'auto',
                }}
              >
                <Typography variant="subtitle2">Detalles del error:</Typography>
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HomeIcon />}
                onClick={() => window.location.href = '/'}
              >
                Ir al inicio
              </Button>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Recargar la página
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
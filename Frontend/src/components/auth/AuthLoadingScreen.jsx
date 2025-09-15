import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Fade,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { verifyToken, getCurrentUser, logout } from '@/services/authService';

const AuthLoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Step 1: Verificar token
        setCurrentStep(1);
        setError(null);
        
        // Verificar si hay un token
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Verificar token con el servidor
        const isValid = await verifyToken(token);
        if (!isValid) {
          await logout();
          navigate('/login');
          return;
        }

        // Step 2: Obtener datos del usuario
        setCurrentStep(2);
        const userProfile = await getCurrentUser();
        
        if (!userProfile) {
          await logout();
          navigate('/login');
          return;
        }

        // Step 3: Redirigir según el rol
        setCurrentStep(3);
        
        switch (userProfile.role) {
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'INSTRUCTOR':
            navigate('/instructor/dashboard');
            break;
          case 'STUDENT':
          default:
            navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error en la verificación de autenticación:', error);
        setError(error.message || 'Error al verificar la autenticación');
        await logout();
        
        // Redirigir al login después de mostrar el error
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  // Manejar cierre del mensaje de error
  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        p: 3,
        textAlign: 'center',
        position: 'relative'
      }}
    >
      {error ? (
        <Box sx={{ textAlign: 'center' }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Error de autenticación
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirigiendo a la página de inicio de sesión...
          </Typography>
        </Box>
      ) : (
        <Fade in={loading}>
          <Box>
            <Box sx={{ position: 'relative', width: 100, height: 100, mx: 'auto', mb: 3 }}>
              <CircularProgress
                size={100}
                thickness={2}
                sx={{
                  color: theme.palette.primary.main,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                  bgcolor: 'background.paper',
                  borderRadius: '50%',
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${theme.palette.primary.main}`
                }}
              >
                <Typography variant="h6" color="primary">
                  {currentStep}/3
                </Typography>
              </Box>
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Verificando su sesión...
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
              {currentStep === 1 && 'Verificando credenciales...'}
              {currentStep === 2 && 'Cargando su perfil...'}
              {currentStep === 3 && 'Redirigiendo...'}
            </Typography>
          </Box>
        </Fade>
      )}
      
      {/* Snackbar para mostrar errores */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthLoadingScreen;

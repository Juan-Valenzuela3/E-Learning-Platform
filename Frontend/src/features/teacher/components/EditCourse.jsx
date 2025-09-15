import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Datos del curso - en una aplicación real, estos vendrían de una API
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    level: 'Principiante',
    status: 'Borrador',
    image: null,
    urlVideo: '',
    duration: 0,
    resources: [],
    completed: false,
    instructor: 'Juan Pérez',
    rating: 0,
    totalStudents: 0,
    modules: [
      {
        id: Date.now(),
        title: 'Módulo 1: Introducción',
        description: '',
        lessons: [
          {
            id: Date.now() + 1,
            title: 'Bienvenida al curso',
            type: 'video',
            video: null,
            duration: 0,
            resources: [],
            completed: false
          }
        ]
      }
    ],
    students: [],
  });

  // Simular carga de datos del curso
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // En una aplicación real, harías una llamada a la API aquí
        // const response = await api.get(`/courses/${courseId}`);
        // setFormData(response.data);
        
        // Datos de ejemplo
        setTimeout(() => {
          setFormData({
            title: 'Curso de Ejemplo',
            description: 'Esta es una descripción de ejemplo para el curso.',
            category: 'programacion',
            price: '29.99',
            level: 'Intermedio',
            status: 'Publicado',
            students: []
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Error al cargar el curso');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el curso
    console.log('Datos actualizados del curso:', formData);
    // Redirigir a la lista de cursos después de guardar
    navigate('/teacher/courses');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/teacher/courses')}
          sx={{ mt: 2 }}
        >
          Volver a la lista de cursos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/teacher/courses')}
        sx={{ mb: 2 }}
      >
        Volver a la lista
      </Button>
      
      <Typography variant="h4" component="h1" gutterBottom>
        Editar Curso
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Título del curso"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Categoría"
                >
                  <MenuItem value="programacion">Programación</MenuItem>
                  <MenuItem value="diseno">Diseño</MenuItem>
                  <MenuItem value="negocios">Negocios</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="idiomas">Idiomas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Nivel</InputLabel>
                <Select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  label="Nivel"
                >
                  <MenuItem value="Principiante">Principiante</MenuItem>
                  <MenuItem value="Intermedio">Intermedio</MenuItem>
                  <MenuItem value="Avanzado">Avanzado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Precio"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: '$',
                }}
              />
              <FormHelperText>Dejar en 0 para hacer el curso gratuito</FormHelperText>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="Borrador">Borrador</MenuItem>
                  <MenuItem value="Publicado">Publicado</MenuItem>
                  <MenuItem value="Archivado">Archivado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
                      // Lógica para eliminar el curso
                      navigate('/teacher/courses');
                    }
                  }}
                >
                  Eliminar Curso
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/teacher/courses')}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    startIcon={<SaveIcon />}
                  >
                    Guardar Cambios
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default EditCourse;
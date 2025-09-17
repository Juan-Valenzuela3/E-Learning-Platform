// src/features/teacher/components/TeacherCourses.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Stack, 
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  People as PeopleIcon, 
  BarChart as StatsIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

import { useTeacherCourses } from '@/shared/hooks/useTeacherCourses'; // ✅ Importa el nuevo custom hook

// Componentes de estado de carga
const LoadingState = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="text.secondary">
      Cargando tus cursos...
    </Typography>
  </Box>
);

// Componentes de estado de error
const ErrorState = ({ message }) => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h6" color="error.main">
      Error: {message}
    </Typography>
  </Box>
);

const TeacherCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  // ✅ Usa el custom hook para obtener los datos de la API
  const { courses, loading, error } = useTeacherCourses();

  // Muestra el estado de carga o error si es necesario
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Activo': return 'success';
      case 'Borrador': return 'warning';
      case 'Archivado': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mis Cursos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          component={Link}
          to="/teacher/courses/create"
        >
          Nuevo Curso
        </Button>
      </Stack>
      
      {/* Search and filter section */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Borrador">Borrador</MenuItem>
                <MenuItem value="Archivado">Archivado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {filteredCourses.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No tienes cursos creados o no hay resultados para tu búsqueda.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredCourses.map((course) => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.image || 'https://via.placeholder.com/400x200?text=Imagen+del+curso'}
                  alt={`Imagen de ${course.title}`}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {course.title}
                    </Typography>
                    <Chip label={course.status} color={getStatusColor(course.status)} size="small" sx={{ ml: 1 }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Estudiantes: {course.students || 0}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} mt={2}>
                    <Box>
                      <Tooltip title="Ver estudiantes">
                        <IconButton
                          size="small"
                          href={`/teacher/courses/${course.id}/students`}
                          sx={{
                            color: 'gray.500',
                            '&:hover': {
                              color: 'blue.500',
                              bgcolor: 'rgba(59, 130, 246, 0.1)'
                            }
                          }}
                        >
                          <PeopleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Ver estadísticas">
                        <IconButton
                          size="small"
                          href={`/teacher/courses/${course.id}/stats`}
                          sx={{
                            color: 'gray.500',
                            '&:hover': {
                              color: 'red.500',
                              bgcolor: 'rgba(239, 68, 68, 0.1)'
                            }
                          }}
                        >
                          <StatsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Editar curso">
                        <IconButton 
                          size="small"
                          href={`/teacher/courses/${course.id}/edit`}
                          sx={{ 
                            color: 'gray.500',
                            '&:hover': {
                              color: 'red.500',
                              bgcolor: 'rgba(239, 68, 68, 0.1)'
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Stack>
                  
                  <Typography variant="caption" color="gray.400" sx={{ display: 'block', mt: 1 }}>
                    Actualizado {course.lastUpdated}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TeacherCourses;
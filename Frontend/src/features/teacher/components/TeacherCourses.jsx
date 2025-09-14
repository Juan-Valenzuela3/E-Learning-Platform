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

const TeacherCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  
  // Datos de ejemplo - en una aplicación real, estos vendrían de una API
  const courses = [
    { 
      id: 1, 
      title: 'Introducción a React', 
      description: 'Aprende los fundamentos de React y construye aplicaciones modernas',
      students: 25, 
      status: 'Activo',
      progress: 78,
      image: 'https://source.unsplash.com/random/400x200/?react',
      category: 'Desarrollo Web',
      lastUpdated: 'Hace 2 días'
    },
    { 
      id: 2, 
      title: 'JavaScript Avanzado', 
      description: 'Domina conceptos avanzados de JavaScript moderno',
      students: 18, 
      status: 'Activo',
      progress: 65,
      image: 'https://source.unsplash.com/random/400x200/?javascript',
      category: 'Programación',
      lastUpdated: 'Hace 1 semana'
    },
    { 
      id: 3, 
      title: 'Bases de Datos SQL', 
      description: 'Aprende a diseñar y consultar bases de datos relacionales',
      students: 0, 
      status: 'Borrador',
      progress: 0,
      image: 'https://source.unsplash.com/random/400x200/?database',
      category: 'Bases de Datos',
      lastUpdated: 'Hace 1 mes'
    },
  ];

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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header with search and actions */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', md: 'center' }, 
        gap: 2, 
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700, 
            color: 'gray.900',
            mb: 0.5
          }}>
            Mis Cursos
          </Typography>
          <Typography variant="body2" color="gray.600">
            Gestiona y crea nuevos cursos para tus estudiantes
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/teacher/courses/new"
          sx={{
            bgcolor: 'red.500',
            '&:hover': {
              bgcolor: 'red.600'
            },
            alignSelf: { xs: 'stretch', md: 'center' },
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.25)'
          }}
        >
          Crear nuevo curso
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'gray.200',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' }
        }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { 
                backgroundColor: 'white',
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'red.300',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red.500',
                },
              }
            }}
          />
          
          <FormControl 
            variant="outlined" 
            size="small"
            sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}
          >
            <InputLabel>Filtrar por estado</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filtrar por estado"
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'red.300',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'red.500',
                },
              }}
            >
              <MenuItem value="todos">Todos los estados</MenuItem>
              <MenuItem value="Activo">Activos</MenuItem>
              <MenuItem value="Borrador">Borradores</MenuItem>
              <MenuItem value="Archivado">Archivados</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {filteredCourses.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          p: 6, 
          bgcolor: 'gray.50', 
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'gray.200'
        }}>
          <Typography variant="h6" color="gray.500" gutterBottom>
            No se encontraron cursos
          </Typography>
          <Typography variant="body2" color="gray.500" sx={{ mb: 3 }}>
            {searchTerm || statusFilter !== 'todos' 
              ? 'Intenta con otros términos de búsqueda o filtros' 
              : 'Aún no has creado ningún curso'}
          </Typography>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<AddIcon />}
            href="/teacher/courses/new"
            sx={{
              borderColor: 'red.500',
              color: 'red.500',
              '&:hover': {
                borderColor: 'red.600',
                backgroundColor: 'rgba(239, 68, 68, 0.04)'
              }
            }}
          >
            Crear mi primer curso
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'gray.200',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={course.image}
                  alt={course.title}
                  sx={{ 
                    borderTopLeftRadius: 8, 
                    borderTopRightRadius: 8,
                    objectFit: 'cover'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Chip 
                      label={course.status}
                      size="small"
                      color={getStatusColor(course.status)}
                      variant={course.status === 'Borrador' ? 'outlined' : 'filled'}
                      sx={{ 
                        fontWeight: 500,
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                    <Chip 
                      label={course.category}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        color: 'gray.600',
                        borderColor: 'gray.300',
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.7rem'
                        }
                      }}
                    />
                  </Stack>
                  
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      color: 'gray.900',
                      minHeight: '3.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {course.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="gray.600" 
                    sx={{ 
                      mb: 2,
                      minHeight: '3em',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {course.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="gray.500">
                        Progreso del curso
                      </Typography>
                      <Typography variant="caption" color="gray.900" fontWeight={500}>
                        {course.progress}%
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      width: '100%', 
                      height: 6, 
                      bgcolor: 'gray.100',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}>
                      <Box 
                        sx={{ 
                          width: `${course.progress}%`, 
                          height: '100%', 
                          bgcolor: 'red.500',
                          borderRadius: 3
                        }} 
                      />
                    </Box>
                  </Box>
                  
                  <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{ 
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid',
                      borderColor: 'gray.100'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon fontSize="small" sx={{ color: 'gray.400' }} />
                      <Typography variant="body2" color="gray.600">
                        {course.students} {course.students === 1 ? 'estudiante' : 'estudiantes'}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver estadísticas">
                        <IconButton 
                          size="small"
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

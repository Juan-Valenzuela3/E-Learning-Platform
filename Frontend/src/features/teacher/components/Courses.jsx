import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  BarChart as BarChartIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Star as StarIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  MoreVert as MoreVertIcon,
  Book as BookIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)(({ status, theme }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  fontWeight: 600,
  backgroundColor: status === 'publicado' ? theme.palette.success.light : theme.palette.warning.light,
  color: status === 'publicado' ? theme.palette.success.dark : theme.palette.warning.dark,
}));

const Courses = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  // State
  const [tabValue, setTabValue] = useState('publicados');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      title: 'Introducción a la Programación', 
      description: 'Aprende los fundamentos de la programación desde cero',
      students: 124, 
      rating: 4.7, 
      status: 'publicado',
      lastUpdated: '2023-05-15',
      duration: '8 semanas',
      lessons: 24,
      category: 'Programación',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    },
    { 
      id: 2, 
      title: 'Desarrollo Web Moderno', 
      description: 'Domina React, Node.js y las tecnologías web más actuales',
      students: 89, 
      rating: 4.5, 
      status: 'publicado',
      lastUpdated: '2023-06-20',
      duration: '12 semanas',
      lessons: 36,
      category: 'Desarrollo Web',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80'
    },
    { 
      id: 3, 
      title: 'Machine Learning para Principiantes', 
      description: 'Introducción práctica al aprendizaje automático y ciencia de datos',
      students: 56, 
      rating: 4.8, 
      status: 'borrador',
      lastUpdated: '2023-07-10',
      duration: '10 semanas',
      lessons: 30,
      category: 'Ciencia de Datos',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    },
  ]);

  // Filter courses based on search and tab
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = tabValue === 'publicados' ? course.status === 'publicado' : course.status === 'borrador';
    return matchesSearch && matchesTab;
  });

  // Handlers
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, course) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourse(course);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourse(null);
  };

  const handleEditCourse = (courseId) => {
    console.log('Editar curso:', courseId);
    navigate(`/teacher/courses/${courseId}/edit`);
    handleMenuClose();
  };

  const handleDeleteCourse = (courseId) => {
    console.log('Eliminar curso:', courseId);
    // TODO: Add delete confirmation and API call
    handleMenuClose();
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'grid' ? 'list' : 'grid');
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render course card (grid view)
  const renderCourseCard = (course) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
      <StyledCard>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="140"
            image={course.image}
            alt={course.title}
          />
          <StatusChip 
            label={course.status === 'publicado' ? 'Publicado' : 'Borrador'} 
            status={course.status}
            size="small"
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="h3" noWrap>
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            minHeight: '60px'
          }}>
            {course.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {course.students} estudiantes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {course.duration}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BookIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {course.lessons} lecciones
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon fontSize="small" sx={{ color: 'warning.main', mr: 0.5 }} />
            <Typography variant="body2" sx={{ mr: 1 }}>
              {course.rating}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
          <Box>
            <Tooltip title="Ver curso">
              <IconButton size="small" onClick={() => navigate(`/teacher/courses/${course.id}`)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => handleEditCourse(course.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Estadísticas">
              <IconButton size="small">
                <BarChartIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <IconButton size="small" onClick={(e) => handleMenuOpen(e, course)}>
            <MoreVertIcon />
          </IconButton>
        </CardActions>
      </StyledCard>
    </Grid>
  );

  // Render course list item (list view)
  const renderCourseListItem = (course) => (
    <Grid item xs={12} key={course.id} sx={{ mb: 2 }}>
      <Card>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ width: { xs: '100%', sm: 200 }, position: 'relative' }}>
            <CardMedia
              component="img"
              height="140"
              image={course.image}
              alt={course.title}
              sx={{ height: '100%', objectFit: 'cover' }}
            />
            <StatusChip 
              label={course.status === 'publicado' ? 'Publicado' : 'Borrador'} 
              status={course.status}
              size="small"
              sx={{ position: 'absolute', top: 8, right: 8 }}
            />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" component="h3">
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.category}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StarIcon fontSize="small" sx={{ color: 'warning.main', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    {course.rating}
                  </Typography>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, course)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {course.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.students} estudiantes
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.duration}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BookIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {course.lessons} lecciones
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
              <Button 
                size="small" 
                startIcon={<VisibilityIcon />}
                onClick={() => navigate(`/teacher/courses/${course.id}`)}
              >
                Ver
              </Button>
              <Button 
                size="small" 
                startIcon={<EditIcon />}
                onClick={() => handleEditCourse(course.id)}
              >
                Editar
              </Button>
              <Button 
                size="small" 
                startIcon={<BarChartIcon />}
              >
                Estadísticas
              </Button>
            </CardActions>
          </Box>
        </Box>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          mb: 3,
          gap: 2
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Mis Cursos
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/teacher/courses/new"
          >
            Nuevo Curso
          </Button>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 3
        }}>
          <TextField
            placeholder="Buscar cursos..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ 
              flex: 1, 
              maxWidth: { sm: 400 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              size="small"
              startIcon={<GridViewIcon />}
            >
              Cuadrícula
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('list')}
              size="small"
              startIcon={<ViewListIcon />}
            >
              Lista
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="filtros de cursos"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Publicados" value="publicados" />
            <Tab label="Borradores" value="borradores" />
            <Tab label="Todos" value="todos" />
          </Tabs>
        </Box>
      </Box>

      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          py: 8,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron cursos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
            {searchQuery 
              ? 'No hay cursos que coincidan con tu búsqueda. Intenta con otros términos.'
              : `No tienes cursos ${tabValue === 'publicados' ? 'publicados' : 'en borrador'} aún.`}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/teacher/courses/new"
          >
            Crear nuevo curso
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCourses.map(course => 
            viewMode === 'grid' ? renderCourseCard(course) : renderCourseListItem(course)
          )}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          navigate(`/teacher/courses/${selectedCourse?.id}`);
          handleMenuClose();
        }}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1.5 }} />
          Ver detalles
        </MenuItem>
        <MenuItem onClick={() => handleEditCourse(selectedCourse?.id)}>
          <EditIcon fontSize="small" sx={{ mr: 1.5 }} />
          Editar
        </MenuItem>
        <MenuItem>
          <BarChartIcon fontSize="small" sx={{ mr: 1.5 }} />
          Ver estadísticas
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDeleteCourse(selectedCourse?.id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
          Eliminar curso
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Courses;

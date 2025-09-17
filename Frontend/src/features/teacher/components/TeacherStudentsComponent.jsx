// src/components/TeacherStudentsComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Tooltip, // ✅ Se añade Tooltip
  IconButton, // ✅ Se añade IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  PersonAdd as PersonAddIcon,
  Message as MessageIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  PersonOff as PersonOffIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { getStudentsByCourseId } from '@/services/courseService'; // 🚀 Importación del servicio de API

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'activo':
      return 'success';
    case 'inactivo':
      return 'error';
    case 'pendiente':
      return 'warning';
    default:
      return 'default';
  }
};

export default function TeacherStudentsComponent() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ Estado para manejar errores
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // 🚀 Lógica de fetch de datos separada
  const fetchStudents = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);
    try {
      // 🚀 Consumo de la API con el servicio
      const data = await getStudentsByCourseId(courseId);
      setStudents(data);
    } catch (err) {
      console.error('Error al cargar estudiantes:', err);
      setError('No se pudo cargar la lista de estudiantes. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Función para manejar el filtro y la búsqueda
  const filteredStudents = students.filter(student => {
    const matchesSearchTerm = searchTerm === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || student.status.toLowerCase() === statusFilter;

    return matchesSearchTerm && matchesStatus;
  });

  if (loading) {
    return (
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, textAlign: 'center', minHeight: '60vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button onClick={fetchStudents} variant="outlined" sx={{ mt: 2 }}>Reintentar</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header con título y acciones */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Box>
          <Typography variant="h5" component="h1" fontWeight={600} color="text.primary">
            Estudiantes del Curso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona y revisa el progreso de tus estudiantes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            size={isMobile ? 'small' : 'medium'}
          >
            Exportar Lista
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            size={isMobile ? 'small' : 'medium'}
          >
            Agregar Estudiante
          </Button>
        </Box>
      </Box>

      {/* Filtros y búsqueda */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
        '& > *': { flex: 1 }
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar estudiantes..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="outlined" size="small" fullWidth>
          <InputLabel>Filtrar por estado</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filtrar por estado"
          >
            <MenuItem value="todos">Todos los estados</MenuItem>
            <MenuItem value="activo">Activos</MenuItem>
            <MenuItem value="inactivo">Inactivos</MenuItem>
            <MenuItem value="pendiente">Pendientes</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lista de estudiantes */}
      <Grid container spacing={3}>
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={student.avatar}
                      alt={student.name}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      {student.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} noWrap>
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {student.email}
                      </Typography>
                      <Chip
                        label={student.status}
                        size="small"
                        color={getStatusColor(student.status)}
                        sx={{ mt: 0.5, textTransform: 'capitalize' }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progreso del curso
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {student.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={student.progress}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Lecciones
                      </Typography>
                      <Typography variant="body2">
                        {student.completedLessons}/{student.totalLessons}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Último acceso
                      </Typography>
                      <Typography variant="body2">
                        {student.lastAccess}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Se unió el
                      </Typography>
                      <Typography variant="body2">
                        {student.joinDate}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  {/* ✅ Tooltips e IconButton añadidos */}
                  <Tooltip title="Enviar mensaje">
                    <IconButton size="small" color="primary">
                      <MessageIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver perfil">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenDialog(true);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <PeopleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No se encontraron estudiantes
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* Diálogo de detalles del estudiante */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedStudent && (
          <>
            <DialogTitle>Detalles del Estudiante</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                <Avatar
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  sx={{ width: 80, height: 80, mb: 2 }}
                >
                  {selectedStudent.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" fontWeight={600} align="center">
                  {selectedStudent.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {selectedStudent.email}
                </Typography>
                <Chip
                  label={selectedStudent.status}
                  color={getStatusColor(selectedStudent.status)}
                  size="small"
                  sx={{ mt: 1, textTransform: 'capitalize' }}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  PROGRESO DEL CURSO
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={selectedStudent.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {selectedStudent.progress}%
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Lecciones completadas
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.completedLessons} de {selectedStudent.totalLessons}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Último acceso
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.lastAccess}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de inscripción
                    </Typography>
                    <Typography variant="body1">
                      {selectedStudent.joinDate}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setOpenDialog(false)}
                color="inherit"
              >
                Cerrar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<MessageIcon />}
              >
                Enviar mensaje
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
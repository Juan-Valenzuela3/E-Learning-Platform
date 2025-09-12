import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';

import { Search as SearchIcon, Email as EmailIcon, Person as PersonIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const TeacherStudents = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Redirigir a la lista general si no hay courseId en la URL
  useEffect(() => {
    if (!courseId) {
      navigate('/teacher/students', { replace: true });
      return;
    }
  }, [courseId, navigate]);

  // Datos de ejemplo - en una aplicación real, estos vendrían de una API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Simular carga de datos
        setTimeout(() => {
          const mockStudents = Array(15).fill().map((_, i) => ({
            id: `student-${i + 1}`,
            name: `Estudiante ${i + 1}`,
            email: `estudiante${i + 1}@example.com`,
            joined: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
            progress: Math.floor(Math.random() * 100),
            lastAccess: new Date(Date.now() - Math.random() * 10000000).toLocaleString(),
            status: ['Activo', 'Inactivo', 'Suspendido'][Math.floor(Math.random() * 3)]
          }));

          setStudents(mockStudents);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        setLoading(false);
      }
    };

    if (courseId) fetchStudents();
  }, [courseId]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewStudent = (student) => {
    // Navegar al perfil del estudiante o mostrar detalles
    console.log('Ver estudiante:', student);
  };

  const handleSendMessage = (student) => {
    // Lógica para enviar mensaje al estudiante
    console.log('Enviar mensaje a:', student.email);
  };

  const handleOpenDialog = (student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
  };

  const handleRemoveStudent = () => {
    if (selectedStudent) {
      // Lógica para eliminar al estudiante del curso
      console.log('Eliminar estudiante:', selectedStudent.id);
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      handleCloseDialog();
    }
  };

  // Filtrar estudiantes según el término de búsqueda
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography>Cargando estudiantes...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Estudiantes del Curso {courseId ? `- ${courseId}` : ''}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => navigate('/teacher/students')}
          >
            Volver a Cursos
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/teacher/courses/${courseId}`)}
          >
            Ver Curso
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar estudiantes..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Progreso</TableCell>
                <TableCell>Último acceso</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <TableRow hover key={student.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{student.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Se unió el {student.joined}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box width="100%" maxWidth={100}>
                          <Box
                            bgcolor="primary.light"
                            height={8}
                            borderRadius={4}
                            position="relative"
                            overflow="hidden"
                          >
                            <Box
                              bgcolor="primary.main"
                              position="absolute"
                              left={0}
                              top={0}
                              bottom={0}
                              width={`${student.progress}%`}
                            />
                          </Box>
                        </Box>
                        <Typography variant="caption">{student.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{student.lastAccess}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.status}
                        color={
                          student.status === 'Activo' ? 'success' :
                            student.status === 'Inactivo' ? 'default' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Tooltip title="Ver perfil">
                          <IconButton
                            size="small"
                            onClick={() => handleViewStudent(student)}
                            color="primary"
                          >
                            <PersonIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Enviar mensaje">
                          <IconButton
                            size="small"
                            onClick={() => handleSendMessage(student)}
                            color="primary"
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="subtitle1" color="textSecondary">
                      No se encontraron estudiantes que coincidan con la búsqueda
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Estudiantes por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>

      {/* Diálogo de confirmación para eliminar estudiante */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Eliminar estudiante del curso?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar a {selectedStudent?.name} de este curso?
            El estudiante perderá el acceso al material del curso.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleRemoveStudent} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherStudents;
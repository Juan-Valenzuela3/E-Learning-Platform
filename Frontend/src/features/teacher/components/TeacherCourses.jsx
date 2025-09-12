import React from 'react';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const TeacherCourses = () => {
  // Datos de ejemplo - en una aplicación real, estos vendrían de una API
  const courses = [
    { id: 1, title: 'Introducción a React', students: 25, status: 'Activo' },
    { id: 2, title: 'JavaScript Avanzado', students: 18, status: 'Activo' },
    { id: 3, title: 'Bases de Datos SQL', students: 0, status: 'Borrador' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Mis Cursos</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          href="/teacher/courses/new"
        >
          Nuevo Curso
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course.id}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>{course.title}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Estudiantes: {course.students}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{
                  color: course.status === 'Activo' ? 'success.main' : 'text.secondary',
                  fontWeight: 'medium'
                }}
              >
                {course.status}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  href={`/teacher/courses/${course.id}/edit`}
                >
                  Editar
                </Button>
                <Button 
                  variant="outlined" 
                  size="small"
                  color="secondary"
                  href={`/teacher/courses/${course.id}/students`}
                >
                  Ver Estudiantes
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeacherCourses;

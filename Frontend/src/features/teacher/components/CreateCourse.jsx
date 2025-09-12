import React, { useState } from 'react';
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
  Snackbar,
  Alert,
  InputAdornment
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    level: 'Principiante',
    status: 'Borrador'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!formData.category) newErrors.category = 'La categoría es obligatoria';
    if (formData.price !== '' && Number(formData.price) < 0) newErrors.price = 'El precio no puede ser negativo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // limpiar error del campo editado
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const mockCreateCourse = () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 800));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ open: true, message: 'Por favor corrige los errores del formulario', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      const res = await mockCreateCourse();
      if (res.ok) {
        setToast({ open: true, message: 'Curso creado correctamente', severity: 'success' });
        // pequeña demora para que el usuario vea la confirmación
        setTimeout(() => navigate('/teacher/courses'), 400);
      } else {
        throw new Error('No se pudo crear el curso');
      }
    } catch (err) {
      setToast({ open: true, message: err.message || 'Error al crear el curso', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Crear Nuevo Curso
      </Typography>

      <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <form onSubmit={handleSubmit} noValidate>
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
                error={!!errors.title}
                helperText={errors.title}
                disabled={loading}
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
                error={!!errors.description}
                helperText={errors.description}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.category} disabled={loading}>
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
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={loading}>
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
                label="Precio (opcional)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.price}
                helperText={errors.price || 'Dejar en blanco para hacer el curso gratuito'}
                disabled={loading}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="Borrador">Borrador</MenuItem>
                  <MenuItem value="Publicado">Publicado</MenuItem>
                </Select>
                <FormHelperText>Puedes guardar como borrador o publicar directamente</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/teacher/courses')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Curso'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateCourse;
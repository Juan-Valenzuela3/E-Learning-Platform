import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Edit,
  Delete,
  Save,
  Cancel,
  FilterList,
  Clear,
  ArrowUpward,
  ArrowDownward,
  MenuBook,
  School,
  AttachMoney,
  People,
} from "@mui/icons-material";
import api from "@/services/api";

export default function CoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]);

  // Estados para modales
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: 0,
    isPremium: false,
    isPublished: false,
    isActive: true,
    estimatedHours: 1,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cargar cursos y categorías
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/courses");
      // Asegurar que siempre sea un array
      const coursesData = Array.isArray(response.data) ? response.data : [];
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.response?.data?.message || "Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/api/categories");
      // Asegurar que siempre sea un array
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Función para abrir modal de edición
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setEditForm({
      title: course.title || "",
      description: course.description || "",
      shortDescription: course.shortDescription || "",
      price: course.price || 0,
      isPremium: course.isPremium || false,
      isPublished: course.isPublished || false,
      isActive: course.isActive !== undefined ? course.isActive : true,
      estimatedHours: course.estimatedHours || 1,
    });
    setEditDialogOpen(true);
  };

  // Función para abrir modal de eliminación
  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  // Función para guardar cambios del curso
  const handleSaveCourse = async () => {
    try {
      await api.put(`/api/courses/${selectedCourse.id}`, editForm);

      // Actualizar la lista de cursos localmente
      setCourses(
        (Array.isArray(courses) ? courses : []).map((course) =>
          course.id === selectedCourse.id ? { ...course, ...editForm } : course
        )
      );

      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Curso actualizado exitosamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Error al actualizar el curso",
        severity: "error",
      });
    }
  };

  // Función para eliminar curso
  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/courses/${selectedCourse.id}`);

      // Actualizar la lista de cursos localmente
      setCourses(
        (Array.isArray(courses) ? courses : []).filter(
          (course) => course.id !== selectedCourse.id
        )
      );

      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: "Curso eliminado exitosamente",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error al eliminar el curso",
        severity: "error",
      });
    }
  };

  // Función para cerrar modales
  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedCourse(null);
  };

  // Función para cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Función para manejar el ordenamiento
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Filtrar y ordenar cursos
  const filteredCourses = (Array.isArray(courses) ? courses : [])
    .filter((course) => {
      // Filtrar por estado
      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && course.isPublished) ||
        (statusFilter === "DRAFT" && !course.isPublished);

      // Filtrar por categoría
      const categoryMatch =
        categoryFilter === "ALL" || course.category?.name === categoryFilter;

      // Filtrar por término de búsqueda
      const searchMatch =
        !searchTerm ||
        (course.title &&
          course.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.description &&
          course.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (course.instructor?.userName &&
          course.instructor.userName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      return statusMatch && categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title || "";
          bValue = b.title || "";
          break;
        case "price":
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        case "students":
          aValue = a.studentsCount || 0;
          bValue = b.studentsCount || 0;
          break;
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchCourses}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}>
        <Typography variant="h4">Gestión de Cursos</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {filteredCourses.length} de {courses.length} cursos
          {statusFilter !== "ALL" && ` • Filtrado por: ${statusFilter}`}
          {categoryFilter !== "ALL" && ` • Categoría: ${categoryFilter}`}
          {searchTerm && ` • Búsqueda: "${searchTerm}"`}
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<MenuBook />}
          onClick={() => navigate("/admin/cursos/nuevo")}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: { xs: "100%", sm: "auto" },
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s",
          }}>
          Nuevo Curso
        </Button>
      </Box>

      {/* Barra de búsqueda */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar cursos por título, descripción o instructor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "error.main" }} />,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "error.main",
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "error.main",
                  borderWidth: 2,
                },
              },
            },
          }}
        />
      </Paper>

      {/* Filtros */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterList sx={{ color: "error.main" }} />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.primary">
              Filtros:
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Estado"
                sx={{ borderRadius: 2 }}>
                <MenuItem value="ALL">Todos</MenuItem>
                <MenuItem value="PUBLISHED">Publicados</MenuItem>
                <MenuItem value="DRAFT">Borradores</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Categoría"
                sx={{ borderRadius: 2 }}>
                <MenuItem value="ALL">Todas</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(statusFilter !== "ALL" ||
              categoryFilter !== "ALL" ||
              searchTerm) && (
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  setStatusFilter("ALL");
                  setCategoryFilter("ALL");
                  setSearchTerm("");
                }}
                startIcon={<Clear />}
                sx={{
                  textTransform: "none",
                  color: "text.secondary",
                  "&:hover": { bgcolor: "grey.100" },
                }}>
                Limpiar filtros
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Tabla de cursos */}
      {filteredCourses.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || statusFilter !== "ALL" || categoryFilter !== "ALL"
              ? `No se encontraron cursos con los filtros aplicados`
              : "No hay cursos registrados"}
          </Typography>
          {(searchTerm ||
            statusFilter !== "ALL" ||
            categoryFilter !== "ALL") && (
            <Button
              variant="outlined"
              onClick={() => {
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
                setSearchTerm("");
              }}
              startIcon={<Clear />}
              sx={{ mt: 2 }}>
              Limpiar filtros
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "auto",
            maxWidth: "100%",
          }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "error.main" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                  onClick={() => handleSort("id")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    ID
                    {sortBy === "id" &&
                      (sortOrder === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                  onClick={() => handleSort("title")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Título
                    {sortBy === "title" &&
                      (sortOrder === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    display: { xs: "none", md: "table-cell" },
                  }}>
                  Instructor
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    display: { xs: "none", lg: "table-cell" },
                  }}>
                  Categoría
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                  onClick={() => handleSort("price")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Precio
                    {sortBy === "price" &&
                      (sortOrder === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    display: { xs: "none", sm: "table-cell" },
                  }}>
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    display: { xs: "none", lg: "table-cell" },
                    cursor: "pointer",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                  onClick={() => handleSort("students")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Estudiantes
                    {sortBy === "students" &&
                      (sortOrder === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    display: { xs: "none", xl: "table-cell" },
                    cursor: "pointer",
                    "&:hover": { bgcolor: "error.dark" },
                  }}
                  onClick={() => handleSort("createdAt")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Fecha
                    {sortBy === "createdAt" &&
                      (sortOrder === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      ))}
                  </Box>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "white", fontWeight: 600 }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow
                  key={course.id}
                  sx={{
                    "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                    "&:hover": { bgcolor: "error.50" },
                    transition: "background-color 0.2s",
                  }}>
                  <TableCell sx={{ fontWeight: 500, color: "error.main" }}>
                    #{course.id}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        sx={{ maxWidth: 200 }}>
                        {course.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: 200 }}>
                        {course.shortDescription}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <School sx={{ fontSize: 16, color: "primary.main" }} />
                      <Typography variant="body2">
                        {course.instructor?.userName}{" "}
                        {course.instructor?.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                    <Chip
                      label={course.category?.name || "Sin categoría"}
                      size="small"
                      sx={{
                        bgcolor: "primary.100",
                        color: "primary.700",
                        border: "none",
                        "& .MuiChip-label": { color: "inherit" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AttachMoney
                        sx={{ fontSize: 16, color: "success.main" }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        ${course.price?.toFixed(2) || "0.00"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      <Chip
                        label={course.isPublished ? "Publicado" : "Borrador"}
                        size="small"
                        sx={{
                          bgcolor: course.isPublished
                            ? "success.100"
                            : "warning.100",
                          color: course.isPublished
                            ? "success.700"
                            : "warning.700",
                          border: "none",
                          "& .MuiChip-label": { color: "inherit" },
                        }}
                      />
                      {course.isPremium && (
                        <Chip
                          label="Premium"
                          size="small"
                          sx={{
                            bgcolor: "error.100",
                            color: "error.700",
                            border: "none",
                            "& .MuiChip-label": { color: "inherit" },
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <People sx={{ fontSize: 16, color: "info.main" }} />
                      <Typography variant="body2">
                        {course.studentsCount || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      display: { xs: "none", xl: "table-cell" },
                      color: "text.secondary",
                    }}>
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString("es-ES")
                      : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "flex-end",
                      }}>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          onClick={() => handleEditCourse(course)}
                          sx={{
                            color: "primary.main",
                            "&:hover": { bgcolor: "primary.50" },
                          }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCourse(course)}
                          sx={{
                            color: "error.main",
                            "&:hover": { bgcolor: "error.50" },
                          }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de Edición */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
        }}>
        <DialogTitle
          sx={{
            bgcolor: "error.main",
            color: "white",
            fontSize: "1.25rem",
            fontWeight: 600,
            py: 2,
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Edit sx={{ fontSize: "1.5rem" }} />
            Editar Curso
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: "grey.50" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Título del Curso"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              fullWidth
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "white",
                },
              }}
            />
            <TextField
              label="Descripción Corta"
              value={editForm.shortDescription}
              onChange={(e) =>
                setEditForm({ ...editForm, shortDescription: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "white",
                },
              }}
            />
            <TextField
              label="Descripción Completa"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "white",
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Precio"
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                  },
                }}
              />
              <TextField
                label="Horas Estimadas"
                type="number"
                value={editForm.estimatedHours}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    estimatedHours: parseInt(e.target.value) || 1,
                  })
                }
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: "white",
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isPublished}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        isPublished: e.target.checked,
                      })
                    }
                    color="success"
                  />
                }
                label="Curso Publicado"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isPremium}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isPremium: e.target.checked })
                    }
                    color="error"
                  />
                }
                label="Curso Premium"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isActive}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label="Curso Activo"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "grey.50", gap: 1 }}>
          <Button
            onClick={handleCloseDialogs}
            startIcon={<Cancel />}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3, py: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveCourse}
            variant="contained"
            startIcon={<Save />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              bgcolor: "error.main",
              "&:hover": { bgcolor: "error.dark" },
            }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialogs}
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" },
        }}>
        <DialogTitle
          sx={{
            bgcolor: "error.main",
            color: "white",
            fontSize: "1.25rem",
            fontWeight: 600,
            py: 2,
          }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Delete sx={{ fontSize: "1.5rem" }} />
            Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: "grey.50" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              ¿Estás seguro de que quieres eliminar este curso?
            </Typography>

            {selectedCourse && (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <MenuBook sx={{ fontSize: 40, color: "error.main" }} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedCourse.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedCourse.instructor?.userName}{" "}
                      {selectedCourse.instructor?.lastName}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Chip
                        label={
                          selectedCourse.isPublished ? "Publicado" : "Borrador"
                        }
                        size="small"
                        color={
                          selectedCourse.isPublished ? "success" : "warning"
                        }
                      />
                      {selectedCourse.isPremium && (
                        <Chip label="Premium" size="small" color="error" />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}

            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                ⚠️ Esta acción no se puede deshacer. El curso será eliminado
                permanentemente.
              </Typography>
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "grey.50", gap: 1 }}>
          <Button
            onClick={handleCloseDialogs}
            startIcon={<Cancel />}
            variant="outlined"
            sx={{ borderRadius: 2, px: 3, py: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{ borderRadius: 2, px: 3, py: 1 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

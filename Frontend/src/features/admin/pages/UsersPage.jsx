import { useState, useEffect } from "react";
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
  AdminPanelSettings,
  School,
  Person,
} from "@mui/icons-material";
import api from "@/services/api";
import { adminService } from "@/services/adminService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  // Estado para los stats de usuarios
  const [userStats, setUserStats] = useState({ total: 0, admin: 0, instructor: 0, student: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Estados para modales
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({
    userName: "",
    lastName: "",
    email: "",
    role: "STUDENT",
    isActive: true,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/api/users/all");
      // Asegurar que users siempre sea un array
      let usersData = response.data;
      if (!Array.isArray(usersData)) {
        // Si es objeto, buscar un array dentro de sus propiedades
        const possibleArray = Object.values(usersData).find(value => Array.isArray(value));
        usersData = possibleArray || [];
      }
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir modal de edición
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      userName: user.userName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      role: user.role || "STUDENT",
      isActive: user.active !== undefined ? user.active : true,
    });
    setEditDialogOpen(true);
  };

  // Función para abrir modal de eliminación
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Función para guardar cambios del usuario
  const handleSaveUser = async () => {
    try {
      // Nota: Este endpoint no está implementado en el backend actualmente
      // Se simula la actualización local para demostrar la funcionalidad
      const updatedUser = {
        ...selectedUser,
        ...editForm,
        updatedAt: new Date().toISOString(),
      };

      // Actualizar la lista de usuarios localmente
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? updatedUser : user))
      );

      setEditDialogOpen(false);
      setSnackbar({
        open: true,
        message:
          "Usuario actualizado localmente (endpoint no implementado en backend)",
        severity: "warning",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Error al actualizar el usuario",
        severity: "error",
      });
    }
  };

  // Función para eliminar usuario
  const handleConfirmDelete = async () => {
    try {
      // Nota: Este endpoint no está implementado en el backend actualmente
      // Se simula la eliminación local para demostrar la funcionalidad

      // Actualizar la lista de usuarios localmente
      setUsers(users.filter((user) => user.id !== selectedUser.id));

      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message:
          "Usuario eliminado localmente (endpoint no implementado en backend)",
        severity: "warning",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message || "Error al eliminar el usuario",
        severity: "error",
      });
    }
  };

  // Función para cerrar modales
  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedUser(null);
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

  // Fetch stats al montar
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        const stats = await adminService.getStats();
        setUserStats({
          total: stats?.userStats?.totalUsers ?? 0,
          instructor: stats?.userStats?.instructorUsers ?? 0,
          student: stats?.userStats?.studentUsers ?? 0,
        });
      } catch (error) {
        setStatsError(error.message || "Error al cargar estadísticas de usuarios");
      } finally {
        setStatsLoading(false);
      }
    };
    fetchUserStats();
    fetchUsers();
  }, []);

  // Si users no es array, devolver array vacío para evitar crash
  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
      // Filtrar por rol
      const roleMatch = roleFilter === "ALL" || user.role === roleFilter;

      // Filtrar por término de búsqueda
      const searchMatch =
        !searchTerm ||
        (user.userName &&
          user.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.lastName &&
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase()));

      return roleMatch && searchMatch;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "userName":
          aValue = a.userName || "";
          bValue = b.userName || "";
          break;
        case "lastName":
          aValue = a.lastName || "";
          bValue = b.lastName || "";
          break;
        case "email":
          aValue = a.email || "";
          bValue = b.email || "";
          break;
        case "role":
          aValue = a.role || "";
          bValue = b.role || "";
          break;
        case "active":
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
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
        <Button variant="contained" onClick={fetchUsers}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}>
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {filteredUsers.length} de {users.length} usuarios
          {roleFilter !== "ALL" && ` • Filtrado por: ${roleFilter}`}
          {searchTerm && ` • Búsqueda: "${searchTerm}"`}
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "1px solid",
          borderColor: "grey.200",
        }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar usuarios por nombre, apellido o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: "error.main" }} />,
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
              fontSize: { xs: "14px", sm: "16px" },
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

      {/* Filtros rápidos por rol */}
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
              Filtrar por rol:
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "center", sm: "flex-start" },
            }}>
            <Button
              variant={roleFilter === "ALL" ? "contained" : "outlined"}
              size="small"
              onClick={() => setRoleFilter("ALL")}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                px: 2,
                ...(roleFilter === "ALL" && {
                  bgcolor: "error.main",
                  "&:hover": { bgcolor: "error.dark" },
                }),
                ...(roleFilter !== "ALL" && {
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "error.50",
                    borderColor: "error.dark",
                  },
                }),
              }}>
              Todos ({userStats.total})
            </Button>

            <Button
              variant={roleFilter === "ADMIN" ? "contained" : "outlined"}
              size="small"
              onClick={() => setRoleFilter("ADMIN")}
              startIcon={<AdminPanelSettings />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                px: 2,
                ...(roleFilter === "ADMIN" && {
                  bgcolor: "error.main",
                  "&:hover": { bgcolor: "error.dark" },
                }),
                ...(roleFilter !== "ADMIN" && {
                  borderColor: "error.main",
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "error.50",
                    borderColor: "error.dark",
                  },
                }),
              }}>
              Administradores ({userStats.admin})
            </Button>

            <Button
              variant={roleFilter === "INSTRUCTOR" ? "contained" : "outlined"}
              size="small"
              onClick={() => setRoleFilter("INSTRUCTOR")}
              startIcon={<School />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                px: 2,
                ...(roleFilter === "INSTRUCTOR" && {
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }),
                ...(roleFilter !== "INSTRUCTOR" && {
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.50",
                    borderColor: "primary.dark",
                  },
                }),
              }}>
              Instructores ({userStats.instructor})
            </Button>

            <Button
              variant={roleFilter === "STUDENT" ? "contained" : "outlined"}
              size="small"
              onClick={() => setRoleFilter("STUDENT")}
              startIcon={<Person />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                px: 2,
                ...(roleFilter === "STUDENT" && {
                  bgcolor: "grey.600",
                  "&:hover": { bgcolor: "grey.700" },
                }),
                ...(roleFilter !== "STUDENT" && {
                  borderColor: "grey.600",
                  color: "grey.600",
                  "&:hover": {
                    bgcolor: "grey.50",
                    borderColor: "grey.700",
                  },
                }),
              }}>
              Estudiantes ({userStats.student})
            </Button>
          </Box>

          {roleFilter !== "ALL" && (
            <Button
              variant="text"
              size="small"
              onClick={() => setRoleFilter("ALL")}
              startIcon={<Clear />}
              sx={{
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  bgcolor: "grey.100",
                },
              }}>
              Limpiar filtros
            </Button>
          )}
        </Box>
      </Paper>

      {filteredUsers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || roleFilter !== "ALL"
              ? `No se encontraron usuarios con los filtros aplicados${
                  searchTerm ? ` (búsqueda: "${searchTerm}")` : ""
                }${roleFilter !== "ALL" ? ` (rol: ${roleFilter})` : ""}`
              : "No hay usuarios registrados"}
          </Typography>
          {(searchTerm || roleFilter !== "ALL") && (
            <Box
              sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
              {searchTerm && (
                <Button
                  variant="outlined"
                  onClick={() => setSearchTerm("")}
                  startIcon={<Clear />}>
                  Limpiar búsqueda
                </Button>
              )}
              {roleFilter !== "ALL" && (
                <Button
                  variant="outlined"
                  onClick={() => setRoleFilter("ALL")}
                  startIcon={<Clear />}>
                  Limpiar filtros
                </Button>
              )}
            </Box>
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
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "grey.100",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "grey.400",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "grey.500",
              },
            },
          }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "error.main" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "error.dark" },
                    userSelect: "none",
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
                    userSelect: "none",
                  }}
                  onClick={() => handleSort("userName")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Nombre
                    {sortBy === "userName" &&
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
                    userSelect: "none",
                    display: { xs: "none", md: "table-cell" },
                  }}
                  onClick={() => handleSort("lastName")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Apellido
                    {sortBy === "lastName" &&
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
                    userSelect: "none",
                  }}
                  onClick={() => handleSort("email")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Email
                    {sortBy === "email" &&
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
                    userSelect: "none",
                  }}
                  onClick={() => handleSort("role")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Rol
                    {sortBy === "role" &&
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
                    userSelect: "none",
                  }}
                  onClick={() => handleSort("active")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Estado
                    {sortBy === "active" &&
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
                    userSelect: "none",
                    display: { xs: "none", lg: "table-cell" },
                  }}
                  onClick={() => handleSort("createdAt")}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    Fecha de Creación
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
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      bgcolor: "grey.50",
                    },
                    "&:hover": {
                      bgcolor: "error.50",
                    },
                    transition: "background-color 0.2s",
                  }}>
                  <TableCell sx={{ fontWeight: 500, color: "error.main" }}>
                    #{user.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {user.userName || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      display: { xs: "none", md: "table-cell" },
                    }}>
                    {user.lastName || "N/A"}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor:
                          user.role === "ADMIN"
                            ? "error.100 !important"
                            : user.role === "INSTRUCTOR"
                            ? "primary.100 !important"
                            : "grey.100 !important",
                        color:
                          user.role === "ADMIN"
                            ? "error.700 !important"
                            : user.role === "INSTRUCTOR"
                            ? "primary.700 !important"
                            : "grey.700 !important",
                        border: "none",
                        "& .MuiChip-label": {
                          color: "inherit !important",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.active ? "Activo" : "Inactivo"}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        bgcolor: user.active
                          ? "success.100 !important"
                          : "error.100 !important",
                        color: user.active
                          ? "success.700 !important"
                          : "error.700 !important",
                        border: "none",
                        "& .MuiChip-label": {
                          color: "inherit !important",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      display: { xs: "none", lg: "table-cell" },
                    }}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("es-ES")
                      : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        gap: { xs: 0.5, sm: 1 },
                        justifyContent: "flex-end",
                        flexDirection: { xs: "column", sm: "row" },
                      }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        variant="outlined"
                        onClick={() => handleEditUser(user)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                          borderColor: "primary.main",
                          color: "primary.main",
                          minWidth: { xs: "auto", sm: "80px" },
                          px: { xs: 1, sm: 2 },
                          "&:hover": {
                            bgcolor: "primary.50",
                            borderColor: "primary.dark",
                          },
                        }}>
                        <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                          Editar
                        </Box>
                        <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                          ✏️
                        </Box>
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        variant="outlined"
                        onClick={() => handleDeleteUser(user)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                          minWidth: { xs: "auto", sm: "90px" },
                          px: { xs: 1, sm: 2 },
                          "&:hover": {
                            bgcolor: "error.50",
                          },
                        }}>
                        <Box sx={{ display: { xs: "none", sm: "inline" } }}>
                          Eliminar
                        </Box>
                        <Box sx={{ display: { xs: "inline", sm: "none" } }}>
                          🗑️
                        </Box>
                      </Button>
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
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
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
            Editar Usuario
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, bgcolor: "grey.50" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}>
            <TextField
              label="Nombre"
              value={editForm.userName}
              onChange={(e) =>
                setEditForm({ ...editForm, userName: e.target.value })
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
              label="Apellido"
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
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
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
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
            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                label="Rol"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  bgcolor: "white",
                }}>
                <MenuItem value="STUDENT">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label="Estudiante"
                      size="small"
                      sx={{
                        bgcolor: "grey.100 !important",
                        color: "grey.700 !important",
                        border: "none",
                        "& .MuiChip-label": {
                          color: "inherit !important",
                        },
                      }}
                    />
                  </Box>
                </MenuItem>
                <MenuItem value="INSTRUCTOR">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label="Instructor"
                      size="small"
                      sx={{
                        bgcolor: "primary.100 !important",
                        color: "primary.700 !important",
                        border: "none",
                        "& .MuiChip-label": {
                          color: "inherit !important",
                        },
                      }}
                    />
                  </Box>
                </MenuItem>
                <MenuItem value="ADMIN">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label="Administrador"
                      size="small"
                      sx={{
                        bgcolor: "error.100 !important",
                        color: "error.700 !important",
                        border: "none",
                        "& .MuiChip-label": {
                          color: "inherit !important",
                        },
                      }}
                    />
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isActive}
                    onChange={(e) =>
                      setEditForm({ ...editForm, isActive: e.target.checked })
                    }
                    color="success"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "success.main",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "success.main",
                        },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" fontWeight={500}>
                      Usuario Activo
                    </Typography>
                    <Chip
                      label={editForm.isActive ? "Activo" : "Inactivo"}
                      size="small"
                      color={editForm.isActive ? "success" : "error"}
                    />
                  </Box>
                }
              />
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: "grey.50", gap: 1 }}>
          <Button
            onClick={handleCloseDialogs}
            startIcon={<Cancel />}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: "grey.400",
              color: "grey.600",
              "&:hover": {
                borderColor: "grey.600",
                bgcolor: "grey.100",
              },
            }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            startIcon={<Save />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              bgcolor: "error.main",
              "&:hover": {
                bgcolor: "error.dark",
              },
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
          sx: {
            borderRadius: 2,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
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
              ¿Estás seguro de que quieres eliminar al usuario?
            </Typography>

            {selectedUser && (
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
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "error.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}>
                    {selectedUser.userName?.charAt(0)?.toUpperCase() || "U"}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedUser.userName} {selectedUser.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Chip
                        label={selectedUser.role}
                        size="small"
                        sx={{
                          bgcolor:
                            selectedUser.role === "ADMIN"
                              ? "error.100"
                              : selectedUser.role === "INSTRUCTOR"
                              ? "primary.100"
                              : "grey.100",
                          color:
                            selectedUser.role === "ADMIN"
                              ? "error.700"
                              : selectedUser.role === "INSTRUCTOR"
                              ? "primary.700"
                              : "grey.700",
                          border: "none",
                        }}
                      />
                      <Chip
                        label={selectedUser.active ? "Activo" : "Inactivo"}
                        size="small"
                        sx={{
                          bgcolor: selectedUser.active
                            ? "success.100"
                            : "error.100",
                          color: selectedUser.active
                            ? "success.700"
                            : "error.700",
                          border: "none",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )}

            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                ⚠️ Esta acción no se puede deshacer. El usuario será eliminado
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
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              borderColor: "grey.400",
              color: "grey.600",
              "&:hover": {
                borderColor: "grey.600",
                bgcolor: "grey.100",
              },
            }}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            startIcon={<Delete />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}>
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

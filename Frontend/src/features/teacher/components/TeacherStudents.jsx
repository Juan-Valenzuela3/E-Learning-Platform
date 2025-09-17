import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, TextField, InputAdornment, Button, FormControl, InputLabel, Select, MenuItem, Grid, Alert } from "@mui/material";
import { Search as SearchIcon, PersonAdd as PersonAddIcon } from "@mui/icons-material";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import api from "@/services/api"; // ⚡ usar cliente Axios real
import StudentCard from "./StudentCard";  // 💡 separar en subcomponentes
import StudentDialog from "./StudentDialog";
import StudentSummary from "./StudentSummary";

const TeacherStudents = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/courses/${courseId}/students`);
        setStudents(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los estudiantes");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  const filteredStudents = useMemo(() =>
    students.filter(s =>
      (statusFilter === "todos" || s.status === statusFilter) &&
      (searchTerm === "" ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [students, statusFilter, searchTerm]);

  if (loading) return <LoadingSpinner text="Cargando estudiantes..." />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar estudiantes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <FormControl size="small">
          <InputLabel>Estado</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="activo">Activos</MenuItem>
            <MenuItem value="inactivo">Inactivos</MenuItem>
            <MenuItem value="suspendido">Suspendidos</MenuItem>
          </Select>
        </FormControl>
        <Button startIcon={<PersonAddIcon />}>Agregar</Button>
      </Box>

      {/* Resumen */}
      <StudentSummary students={students} />

      {/* Lista */}
      <Grid container spacing={2}>
        {filteredStudents.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onView={() => setSelectedStudent(student)}
          />
        ))}
      </Grid>

      {/* Modal */}
      <StudentDialog
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </Box>
  );
};

export default TeacherStudents;


// src/constants/roles.js
export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin'
}

export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: {
    canEnroll: true,
    canViewCourses: true,
    canSubmitAssignments: true,
    canViewGrades: true,
    canAccessDashboard: '/student'
  },
  [ROLES.TEACHER]: {
    canCreateCourses: true,
    canEditCourses: true,
    canGradeAssignments: true,
    canViewStudents: true,
    canAccessDashboard: '/teacher'
  },
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManageCourses: true,
    canViewAnalytics: true,
    canManageSystem: true,
    canAccessDashboard: '/admin'
  }
}

export const NAVIGATION_ROUTES = {
  [ROLES.STUDENT]: [
    { name: 'Dashboard', path: '/student/dashboard', icon: '📊' },
    { name: 'Cursos', path: '/student/courses', icon: '📚' },
    { name: 'Mis Cursos', path: '/student/my-courses', icon: '🎓' },
    { name: 'Perfil', path: '/student/profile', icon: '👤' }
  ],
  [ROLES.TEACHER]: [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: '📊' },
    { name: 'Mis Cursos', path: '/teacher/my-courses', icon: '📚' },
    { name: 'Crear Curso', path: '/teacher/create-course', icon: '➕' },
    { name: 'Estudiantes', path: '/teacher/students', icon: '👥' },
    { name: 'Perfil', path: '/teacher/profile', icon: '👤' }
  ],
  [ROLES.ADMIN]: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Usuarios', path: '/admin/users', icon: '👥' },
    { name: 'Cursos', path: '/admin/courses', icon: '📚' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { name: 'Configuración', path: '/admin/settings', icon: '⚙️' }
  ]
}

# Endpoints Backend E-Learning Platform

## Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /auth/login | Login de usuario |
| GET    | /auth/validate | Validar token JWT |

## Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/users/register | Registro de usuario |
| GET    | /api/users/{id} | Obtener usuario por ID (ADMIN) |
| GET    | /api/users/role/{role} | Usuarios por rol (ADMIN) |
| GET    | /api/users/all | Todos los usuarios (ADMIN) |
| GET    | /api/users/profile | Perfil usuario autenticado |
| PUT    | /api/users/profile | Actualizar perfil usuario autenticado |
| POST   | /api/users/profile/upload-image | Subir imagen de perfil |

## Cursos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/courses | Crear curso (INSTRUCTOR/ADMIN) |
| GET    | /api/courses | Catálogo público de cursos |
| GET    | /api/courses/{id} | Detalle de curso |
| GET    | /api/courses/instructor/{instructorId} | Cursos por instructor (INSTRUCTOR/ADMIN) |
| GET    | /api/courses/admin/active | Cursos activos (ADMIN) |
| GET    | /api/courses/category/{categoryId} | Cursos por categoría |
| GET    | /api/courses/subcategory/{subcategoryId} | Cursos por subcategoría |
| GET    | /api/courses/category/{categoryId}/subcategory/{subcategoryId} | Cursos por categoría y subcategoría |
| PUT    | /api/courses/{courseId} | Actualizar curso (INSTRUCTOR/ADMIN) |
| DELETE | /api/courses/{courseId} | Eliminar curso (INSTRUCTOR/ADMIN) |
| PATCH  | /api/courses/{courseId}/publish | Publicar/despublicar curso (INSTRUCTOR/ADMIN) |
| POST   | /api/courses/upload-image | Subir imagen de curso (INSTRUCTOR/ADMIN) |

## Videos de Curso
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/course-videos | Agregar video a curso (INSTRUCTOR) |
| GET    | /api/course-videos/course/{courseId} | Videos de un curso |
| GET    | /api/course-videos/{videoId} | Detalle de video |
| PUT    | /api/course-videos/{videoId} | Actualizar video (INSTRUCTOR) |
| DELETE | /api/course-videos/{videoId} | Eliminar video (INSTRUCTOR) |
| PUT    | /api/course-videos/course/{courseId}/reorder | Reordenar videos (INSTRUCTOR) |
| GET    | /api/course-videos/course/{courseId}/can-manage | ¿Puede gestionar videos? (INSTRUCTOR) |

## Categorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/categories | Categorías activas |
| GET    | /api/categories/all | Todas las categorías (ADMIN) |
| GET    | /api/categories/{id} | Detalle de categoría |
| GET    | /api/categories/search | Buscar categorías |
| POST   | /api/categories | Crear categoría (ADMIN) |
| PUT    | /api/categories/{id} | Actualizar categoría (ADMIN) |
| DELETE | /api/categories/{id} | Eliminar categoría (ADMIN) |
| DELETE | /api/categories/{id}/permanent | Eliminar permanente (ADMIN) |
| PUT    | /api/categories/{id}/activate | Activar categoría (ADMIN) |
| PUT    | /api/categories/{id}/deactivate | Desactivar categoría (ADMIN) |

## Subcategorías
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/subcategories | Subcategorías activas |
| GET    | /api/subcategories/all | Todas las subcategorías (ADMIN) |
| GET    | /api/subcategories/{id} | Detalle de subcategoría |
| GET    | /api/subcategories/category/{categoryId} | Subcategorías por categoría |
| GET    | /api/subcategories/search | Buscar subcategorías |
| POST   | /api/subcategories | Crear subcategoría (ADMIN) |
| PUT    | /api/subcategories/{id} | Actualizar subcategoría (ADMIN) |
| DELETE | /api/subcategories/{id} | Eliminar subcategoría (ADMIN) |
| DELETE | /api/subcategories/{id}/permanent | Eliminar permanente (ADMIN) |
| PUT    | /api/subcategories/{id}/activate | Activar subcategoría (ADMIN) |
| PUT    | /api/subcategories/{id}/deactivate | Desactivar subcategoría (ADMIN) |

## Inscripciones (Enrollments)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/enrollments | Inscribirse a curso (STUDENT) |
| GET    | /api/enrollments/my-courses | Mis inscripciones activas (STUDENT) |
| GET    | /api/enrollments/my-courses/all | Todas mis inscripciones (STUDENT) |
| GET    | /api/enrollments/my-courses/completed | Mis cursos completados (STUDENT) |
| GET    | /api/enrollments/{id} | Detalle inscripción (STUDENT/INSTRUCTOR/ADMIN) |
| GET    | /api/enrollments/check/{courseId} | ¿Estoy inscrito? (STUDENT) |
| PUT    | /api/enrollments/{id}/progress | Actualizar progreso (STUDENT) |
| PUT    | /api/enrollments/{id}/complete | Marcar como completado (STUDENT) |
| DELETE | /api/enrollments/{id} | Desinscribirse (STUDENT) |
| GET    | /api/enrollments/course/{courseId} | Inscripciones de un curso (INSTRUCTOR/ADMIN) |
| GET    | /api/enrollments/stats | Estadísticas de inscripciones (ADMIN) |
| GET    | /api/enrollments/recent | Inscripciones recientes (ADMIN) |

## Pagos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/payments | Crear pago |
| GET    | /api/payments/{id} | Detalle de pago |
| GET    | /api/payments/user/{userId} | Pagos por usuario |
| GET    | /api/payments/course/{courseId} | Pagos por curso |
| GET    | /api/payments/status/{status} | Pagos por estado |

## Sesiones de Pago
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/payment-sessions | Crear sesión de pago |
| GET    | /api/payment-sessions/{id} | Detalle de sesión de pago |
| GET    | /api/payment-sessions/user/{userId} | Sesiones por usuario |
| GET    | /api/payment-sessions/course/{courseId} | Sesiones por curso |
| GET    | /api/payment-sessions/status/{status} | Sesiones por estado |

## Stripe
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST   | /api/stripe/create-checkout-session | Crear sesión de checkout Stripe |
| POST   | /api/stripe/webhook | Webhook Stripe |
| GET    | /api/stripe/health | Health Stripe |

## Admin
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | /api/admin/stats | Estadísticas generales (ADMIN) |


## Object Storage

| Método | Endpoint | Descripción |
|--------|------------------------------------------|-------------------------------------------------------------|
| POST   | /api/users/profile/upload-image          | Subir imagen de perfil a Object Storage (JWT, estudiante/instructor) |
| POST   | /api/courses/upload-image                | Subir imagen de portada de curso a Object Storage (JWT, instructor/admin) |




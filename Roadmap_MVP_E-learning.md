# Requerimientos Funcionales y no Funcionales

---

## 🔎 Tabla de Pertinencia de los Requerimientos Propuestos

| Requerimiento                                 | Pertinencia para el MVP |
|-----------------------------------------------|:----------------------:|
| Inscripción de estudiantes a cursos           | ✅ Esencial            |
| Creación y publicación de cursos              | ✅ Esencial            |
| Administración de usuarios y permisos         | ✅ Esencial            |
| Administración de cursos                      | ✅ Esencial            |
| Pasarela de pagos                             | ✅ Esencial            |
| Catálogo de cursos                            | ✅ Esencial            |
| Materiales multimedia                         | ✅ Esencial            |
| Evaluaciones de cada curso                    | ✅ Esencial            |
| Seguimiento del progreso (páneles)            | ✅ Esencial            |
| Creación de perfiles de usuario               | ✅ Esencial            |
| Autenticación y autorización                  | ✅ Esencial            |
| Visualización de videos                       | ✅ Esencial            |
| Formulario de registro                        | ✅ Esencial            |
| Documentación con swagger                     | ⚠️ Importante          |
| Pruebas unitarias                             | ⚠️ Importante          |
| Autenticación con JWT 0Auth                   | ✅ Esencial            |


---

## 🔹 Detalle de Requerimientos Funcionales (RF)

1. **Inscripción de estudiantes a cursos:** Permitir a los estudiantes inscribirse en cursos disponibles mediante un flujo sencillo y seguro.
2. **Creación y publicación de cursos:** Los instructores pueden crear, editar y publicar cursos con materiales asociados.
3. **Administración de usuarios y permisos:** Gestión de roles (estudiante, instructor, admin) y permisos de acceso.
4. **Administración de cursos:** CRUD completo de cursos, incluyendo asignación de instructores y materiales.
5. **Pasarela de pagos:** Integración de pagos para inscripción a cursos, registro y validación de transacciones.
6. **Catálogo de cursos:** Visualización pública y filtrada de todos los cursos disponibles.
7. **Materiales multimedia:** Subida y visualización de videos, PDFs y otros recursos didácticos.
8. **Evaluaciones de cada curso:** Creación y gestión de evaluaciones para medir el aprendizaje.
9. **Seguimiento del progreso (páneles):** Registro y visualización del avance de cada estudiante en sus cursos.
10. **Creación de perfiles de usuario:** Registro y edición de información personal y académica.
11. **Autenticación y autorización:** Acceso seguro mediante login, roles y JWT.
12. **Visualización de videos:** Streaming o descarga de videos educativos.
13. **Formulario de registro:** Interfaz para alta de nuevos usuarios.
14. **Documentación con swagger:** API documentada para facilitar el desarrollo y pruebas.
15. **Pruebas unitarias:** Cobertura básica de pruebas para asegurar calidad del código.

---

## 🔹 Detalle de Requerimientos No Funcionales (RN)

1. **Autenticación con JWT 0Auth:** Seguridad robusta en el acceso a la plataforma.
2. **Despliegue en Oracle Cloud Infrastructure (OCI):** El backend debe ser desplegado en OCI, aprovechando sus servicios de cómputo, almacenamiento y escalabilidad.
3. **Escalabilidad:** Capacidad de soportar crecimiento en usuarios y cursos sin degradar el rendimiento.
4. **Usabilidad:** Interfaz intuitiva, accesible y responsive.
5. **Disponibilidad:** Uptime mínimo del 99% y tolerancia a fallos.
6. **Documentación:** API y manuales claros para usuarios y desarrolladores.
7. **Calidad:** Pruebas unitarias y de integración automatizadas.
8. **Monitoreo y backup:** Herramientas de monitoreo y respaldo automático en OCI.



---

# 🔹 Planeación del Proyecto (MVP E-learning Platform)

## 📅 Planeación Semanal (4 semanas)

| Semana | Backend | Frontend | QA | DevOps |
|--------|---------|----------|----|--------|
| 1 | Modelado de BD y entidades<br>Autenticación y roles<br>Endpoints de usuario y curso (CRUD básico) | Maquetado de landing y registro<br>Formulario de login/registro<br>Catálogo de cursos (mock) | Definir casos de prueba<br>Pruebas de endpoints de usuario/curso | Setup de repositorios<br>CI/CD básico<br>Entorno de desarrollo |
| 2 | Endpoints de inscripción<br>Gestión de materiales multimedia<br>Evaluaciones (modelo y endpoints) | Pantallas de inscripción<br>Visualización de materiales<br>Formulario de evaluación | Pruebas de inscripción y materiales<br>Automatización básica | Integración de pruebas en CI<br>Configuración de base de datos |
| 3 | Gestión de pagos (mock o integración real)<br>Seguimiento de progreso<br>Paneles de usuario | Panel de estudiante/instructor<br>Visualización de progreso<br>Validación de pagos | Pruebas de pagos y progreso<br>Pruebas de paneles | Despliegue en entorno de staging<br>Monitoreo básico |
| 4 | Refactor y optimización<br>Documentación Swagger<br>Corrección de bugs | Ajustes UI/UX<br>Pruebas de usuario<br>Preparación demo | Pruebas de regresión<br>Validación de criterios de aceptación | Despliegue final<br>Backup y rollback plan |

---

## 🔍 Detalle de RF y RN por Sprint

### Semana 1
#### Backend
- Modelado de base de datos (usuarios, roles, cursos)
- Implementación de endpoints de registro, login (JWT) y CRUD básico de cursos
- Validación de datos y control de acceso por roles
#### Frontend
- Maquetado de landing page y formularios de registro/login
- Consumo de endpoints de autenticación y cursos (mock)
- Visualización inicial de catálogo de cursos
#### QA
- Definición de casos de prueba para autenticación y cursos
- Pruebas manuales y unitarias de endpoints
#### DevOps
- Configuración de repositorios y ramas
- Pipeline CI/CD básico
- Entorno de desarrollo local y documentación inicial

### Semana 2
#### Backend
- Endpoints para inscripción de estudiantes a cursos
- Gestión de subida y consulta de materiales multimedia (videos, PDFs)
- Implementación de evaluaciones básicas (modelo y endpoints)
#### Frontend
- Pantallas de inscripción a cursos y visualización de materiales
- Formulario y flujo de evaluaciones
- Mejoras en la experiencia de usuario (UX)
#### QA
- Pruebas de inscripción, subida/descarga de materiales y evaluaciones
- Automatización de pruebas de integración
#### DevOps
- Integración de pruebas en pipeline CI
- Configuración de base de datos en entorno de pruebas

### Semana 3
#### Backend
- Integración de pasarela de pagos (mock o real)
- Endpoints para seguimiento de progreso y paneles de usuario
- Optimización de consultas y seguridad
#### Frontend
- Panel de estudiante/instructor (progreso, cursos inscritos/creados)
- Visualización de progreso y validación de pagos
- Ajustes de UI para paneles
#### QA
- Pruebas de pagos, seguimiento y paneles
- Pruebas de carga y escalabilidad básica
#### DevOps
- Despliegue en entorno de staging (preferiblemente en OCI)
- Monitoreo básico y alertas

### Semana 4
#### Backend
- Refactorización y optimización final
- Documentación Swagger completa
- Corrección de bugs críticos
#### Frontend
- Ajustes finales de UI/UX
- Pruebas de usuario y feedback
- Preparación de demo y materiales de entrega
#### QA
- Pruebas de regresión completas
- Validación de criterios de aceptación
#### DevOps
- Despliegue final en OCI
- Backup, plan de rollback y monitoreo avanzado

---

## 💡 Conclusión

La planeación semanal permite avanzar de lo fundamental a lo avanzado, asegurando calidad y entrega a tiempo. Se recomienda mantener comunicación constante entre equipos y priorizar la documentación y pruebas desde el inicio.

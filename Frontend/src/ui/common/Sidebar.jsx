import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { useNotification } from "@/contexts/NotificationContext";
import { useSidebar } from "@/shared/hooks/useSidebar";
import {
  Home,
  Users,
  User,
  BookOpen,
  //CodeXml,
  LayoutDashboard,
  GraduationCap,
  BookCopy,
  //CalendarDays,
  //MessageSquare,
  Menu,
  X,
  Search,
  ChevronDown,
  BarChart2,
  //Plus,
  ChevronLeft,
  ChevronRight,
  GraduationCap as SchoolIcon,
} from "lucide-react";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";
import { Logout } from "@mui/icons-material";
//import path from "path";

// --- Definición de Links por Rol ---
const getApprenticeLinks = () => [
  { path: "/dashboard", icon: Home, label: "Panel" },
  {
    path: "/mis-cursos",
    icon: BookOpen,
    label: "Mis Cursos",
    subItems: [
      { path: "/mis-cursos", icon: BookOpen, label: "Cursos activos" },
      { path: "/mis-cursos/en-progreso", icon: BookOpen, label: "En progreso" },
      { path: "/mis-cursos/completados", icon: BookOpen, label: "Completados" },
      { path: "/mis-cursos/todos", icon: BookOpen, label: "Todos los cursos" },
    ],
  },

  //TODO: DESCOMENTAR CUANDO SE TENGA LOS ENLACES DE PAGOS
  //{ path: "/pagos", icon: CodeXml, label: "Historial de pagos" },
  { path: "/perfil", icon: User, label: "Perfil" },
  {
    path: "/politica-de-privacidad",
    icon: User,
    label: "Política de privacidad",
  },
];

const getTeacherLinks = () => [
  { path: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    path: "/teacher/courses",
    icon: BookCopy,
    label: "Mis Cursos",
    subItems: [
      { path: "/teacher/courses", icon: BookCopy, label: "Ver Cursos" },
      { path: "/teacher/courses/create", icon: BookCopy, label: "Crear Curso" },
    ],
  },
  { path: "/teacher/students", icon: GraduationCap, label: "Estudiantes" },
  //{ path: "/teacher/analytics", icon: BarChart2, label: "Análisis" },
  { path: "/teacher/profile", icon: User, label: "Perfil" },
];

const adminLinks = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Panel" },
  {
    path: "/admin/usuarios",
    icon: Users,
    label: "Usuarios",
    subItems: [
      { path: "/admin/usuarios", icon: Users, label: "Usuarios" },
      { path: "/admin/usuarios/nuevo", icon: Users, label: "Nuevo Usuario" },
    ],
  },
  {
    path: "/admin/cursos",
    icon: BookCopy,
    label: "Cursos",
    subItems: [
      { path: "/admin/cursos", icon: BookCopy, label: "Listado de Cursos" },
      { path: "/admin/cursos/nuevo", icon: BookCopy, label: "Nuevo Curso" },
    ],
  },

  {
    path: "/admin/reportes",
    icon: BarChart2,
    label: "Reportes",
  },
  { path: "/admin/perfil", icon: User, label: "Perfil" },
  //TODO: DESCOMENTAR CUANDO SE TENGA LOS ENLACES DE CHAT
  //{ path: "/admin/chat", icon: MessageSquare, label: "Chat" },
];

// --- NavLink ---
const NavLink = ({
  to,
  icon: Icon,
  label,
  isActive,
  hasSubItems,
  isExpanded,
  isSubItem,
  onToggle,
  onNavigate,
  isCollapsed,
}) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      onToggle?.();
    } else {
      navigate(to);
      onNavigate?.();
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center w-full p-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group",
          isActive
            ? "bg-indigo-100 text-indigo-900 border-r-4 border-indigo-500"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          isSubItem ? "pl-10 ml-2" : "",
          isCollapsed ? "justify-center px-2" : ""
        )}
        title={isCollapsed ? label : ""}>
        {Icon && (
          <div
            className={cn(
              "flex-shrink-0 w-6 h-6 transition-colors duration-200",
              isActive
                ? "text-indigo-600"
                : "text-gray-500 group-hover:text-gray-700",
              isCollapsed ? "mr-0" : "mr-3"
            )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left font-medium">{label}</span>
            {hasSubItems && (
              <ChevronDown
                className={cn(
                  "w-4 h-4 ml-2 transition-transform duration-200",
                  isExpanded ? "transform rotate-180" : ""
                )}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// --- Sidebar ---
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
  const { isCollapsed, toggleCollapse } = useSidebar();
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const location = useLocation();
  const { user, role, isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();

const handleLogoutClick= ( )=>{
  setShowConfirmDialog(true)
}
const cancelLogout =( )=>{
  setShowConfirmDialog(false)
}

const confirmLogout = async () => {
  setShowConfirmDialog(false);
  console.log("--- Iniciando cierre de sesión ---");
  try {
    await logout({ redirect: true, redirectTo: "/" });
    console.log("--- Cierre de sesión exitoso ---");
    showNotification("¡Hasta luego!", "success");
  } catch (error) {
    console.error("--- Error en el cierre de sesión ---", error);
    showNotification("Ocurrió un error al cerrar la sesión.", "error");
  }
};

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSubItems = (label) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path, exact = true) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleNavigateClose = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.name) return user.name;
    return user.email || "Usuario";
  };

  const formatRole = (role) => {
    const normalizedRole = (role || "").toLowerCase();
    const roles = {
      student: "Estudiante",
      teacher: "Instructor",
      instructor: "Instructor",
      admin: "Administrador",
    };
    return roles[normalizedRole] || "Usuario";
  };

  const getLinksByRole = () => {
    if (!isAuthenticated) return [];
    const userRole = (role || "").toLowerCase();
    // Mapear 'instructor' a 'teacher' para la generación de enlaces
    const normalizedRole = userRole === "instructor" ? "teacher" : userRole;

    switch (normalizedRole) {
      case "student":
        return getApprenticeLinks();
      case "teacher":
        return getTeacherLinks();
      case "admin":
        return adminLinks;
      default:
        return [];
    }
  };

  const filteredLinks = getLinksByRole().filter(
    (link) =>
      link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (link.subItems &&
        link.subItems.some((sub) =>
          sub.label.toLowerCase().includes(searchQuery.toLowerCase())
        ))
  );

  const renderSubItems = (subItems, parentLabel) => {
    if (!expandedItems[parentLabel] || isCollapsed) return null;
    return (
      <div className="mt-2 space-y-1 border-l-2 border-indigo-200 ml-4 pl-4">
        {subItems.map((sub) => (
          <NavLink
            key={sub.path}
            to={sub.path}
            icon={sub.icon}
            label={sub.label}
            isActive={isActive(sub.path)}
            isSubItem
            onNavigate={handleNavigateClose}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 1024);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed z-50 p-2.5 rounded-full bg-white/90 shadow-md lg:hidden left-4 top-4",
          isOpen ? (isCollapsed ? "left-16" : "left-64") : "",
          isScrolled ? "top-3" : "top-4"
        )}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}>
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-40 h-screen overflow-hidden">
        <aside
          className={cn(
            "h-full transition-all duration-300 transform -translate-x-full bg-white border-r border-gray-200",
            isOpen ? "translate-x-0 shadow-xl" : "",
            "lg:translate-x-0 lg:shadow-none",
            isCollapsed ? "w-16" : "w-64"
          )}>
          <div className="flex flex-col h-full overflow-hidden">
            {/* Nombre de la plataforma */}
            <div className="p-4 pt-6 border-b border-gray-200">
              {!isCollapsed ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <SchoolIcon className="w-8 h-8 text-red-500 mr-2" />
                    <h3 className="text-lg font-bold text-gray-800">
                      EduPlatform
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">
                    Plataforma de E-Learning
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <SchoolIcon className="w-6 h-6 text-red-500 mb-1" />
                  <div className="w-8 h-0.5 bg-red-500"></div>
                </div>
              )}
            </div>

            {/* Perfil */}
            <div className="p-4 border-b border-gray-200">
              <div
                className={cn(
                  "flex items-center",
                  isCollapsed ? "justify-center" : "space-x-3"
                )}>
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    {user?.profileImageUrl ? (
                      <AvatarImage
                        src={user.profileImageUrl}
                        alt={getUserDisplayName()}
                      />
                    ) : null}
                    <AvatarFallback>
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <h1 className="text-sm font-medium truncate">
                      {getUserDisplayName()}
                    </h1>
                    <h2 className="text-xs text-gray-500">
                      {formatRole(role)}
                    </h2>
                  </div>
                )}
              </div>
            </div>

            {/* Búsqueda */}
            {!isCollapsed && (
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Navegación */}
            <div className="flex-1 px-3 pb-4 overflow-y-auto">
              <nav className="space-y-2 mt-4">
                {filteredLinks.length > 0
                  ? filteredLinks.map((link) => (
                      <div key={link.path} className="space-y-1">
                        <NavLink
                          to={link.path}
                          icon={link.icon}
                          label={link.label}
                          isActive={isActive(link.path, !link.subItems)}
                          hasSubItems={!!link.subItems}
                          isExpanded={expandedItems[link.label]}
                          onToggle={() => toggleSubItems(link.label)}
                          onNavigate={handleNavigateClose}
                          isCollapsed={isCollapsed}
                        />
                        {link.subItems &&
                          renderSubItems(link.subItems, link.label)}
                      </div>
                    ))
                  : !isCollapsed && (
                      <p className="px-2 py-2 text-sm text-gray-500">
                        No hay enlaces disponibles
                      </p>
                    )}
              </nav>
            </div>

            {/* Botón de colapso */}
            <div className="px-4 py-2 border-t border-gray-200">
              <button
                onClick={toggleCollapse}
                className="w-full flex items-center justify-center py-2 px-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}>
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
                {!isCollapsed && <span className="ml-2 text-sm">Colapsar</span>}
              </button>
            </div>

            {/* Cerrar sesión */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleLogoutClick} // Cambiar a handleLogoutClick
                className={cn(
                  "w-full flex items-center justify-center py-3 px-4 bg-gray-100 hover:bg-red-500 text-gray-700 hover:text-white rounded-xl font-medium hover:scale-105 hover:shadow-lg transition-all duration-300 group relative",
                  isCollapsed ? "px-3" : ""
                )}
                title={isCollapsed ? "Cerrar sesión" : ""}>
                <Logout className={cn("w-4 h-4 transition-all duration-300 group-hover:animate-pulse", isCollapsed ? "" : "mr-2")} />
                {!isCollapsed && (
                  <span className="transition-all duration-300 group-hover:font-semibold">
                    Cerrar sesión
                  </span>
                )}
                <div className="absolute inset-0 rounded-xl bg-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Button>
            </div>

          </div>
        </aside>
      </div>
      {/* Modal de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <Logout className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Cerrar sesión
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que quieres cerrar sesión? Tendrás que iniciar
              sesión nuevamente para acceder a tu cuenta.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

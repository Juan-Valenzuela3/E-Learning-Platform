import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import useAuth from "@/shared/hooks/useAuth";
import {
  Home,
  Users,
  User,
  BookOpen,
  MessageCircle,
  Settings,
  CodeXml,
  MessageSquare,
  Menu,
  X,
  LayoutDashboard,
  GraduationCap,
  BookCopy,
  CalendarDays,
  ChevronRight,
  LogOut,
  Plus,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart2,
} from "lucide-react";
import { Button } from "@/ui/Button";
import { cn } from "@/lib/utils";

// --- Definición de Links por Rol ---
const getApprenticeLinks = (isExpanded) => [
  {
    path: "/dashboard",
    icon: Home,
    label: "Panel",
  },
  {
    path: "/mis-cursos",
    icon: BookOpen,
    label: "Mis Cursos",
  },
  {
    path: "/pagos",
    icon: CodeXml,
    label: "Historial de pagos"
  },
  {
    path: "/perfil",
    icon: User,
    label: "Perfil"
  },
  {
    path: "/politica-de-privacidad",
    icon: Settings,
    label: "Política de privacidad"
  },
];

const getTeacherLinks = (isExpanded) => [
  { path: "/teacher", icon: LayoutDashboard, label: "Panel" },
  { path: "/teacher/courses", icon: BookCopy, label: "Mis Cursos" },
  { path: "/teacher/students", icon: GraduationCap, label: "Mis Alumnos" },
  { path: "/teacher/analytics", icon: BarChart2, label: "Análisis" },
  { path: "/teacher/profile", icon: User, label: "Perfil" },
  { path: "/teacher/courses/new", icon: Plus, label: "Crear Curso", },

  
];

const adminLinks = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Panel" },
  { path: "/admin/usuarios", icon: Users, label: "Usuarios" },
  { path: "/admin/cursos", icon: BookCopy, label: "Cursos" },
  { path: "/admin/agenda", icon: CalendarDays, label: "Agenda" },
  { path: "/admin/perfil", icon: User, label: "Perfil" },
  { path: "/admin/chat", icon: MessageSquare, label: "Chat" },
];

// --- Componente NavLink mejorado ---
const NavLink = ({
  to,
  icon: Icon,
  label,
  isActive,
  notification,
  hasSubItems,
  isExpanded,
  onToggle,
  BarChart2,
  isSubItem = false,
  onNavigate,
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
          "flex items-center w-full p-2.5 text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer group",
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-700 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-gray-700/30",
          isSubItem ? "pl-8" : ""
        )}
      >
        {Icon && (
          <div className={cn(
            "flex-shrink-0 w-6 h-6 mr-3 transition-colors duration-150",
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <span className="flex-1 text-left">{label}</span>
        {notification && (
          <span className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs font-semibold text-white bg-red-500 rounded-full">
            {notification}
          </span>
        )}
        {hasSubItems && (
          <ChevronDown
            className={cn(
              "w-4 h-4 ml-2 transition-transform duration-150",
              isExpanded ? "transform rotate-180" : "",
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
            )}
          />
        )}
      </div>
    </div>
  );
};

const Sidebar = () => {
  // Inicializar isOpen basado en el ancho de la pantalla
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();
  const { user, role, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Obtener enlaces según el rol
  const getLinksByRole = () => {
    if (!isAuthenticated) return [];
    switch (role) {
      case "student":
        return getApprenticeLinks(isOpen);
      case "teacher":
        return getTeacherLinks();
      case "admin":
        return adminLinks;
      default:
        return [];
    }
  };

  const links = getLinksByRole();

  // Manejar el scroll y el cambio de tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 1024);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubItems = (label) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActive = (path, exact = true) => {
    return exact
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  // Cerrar en navegación (móvil) y al cambiar de ruta
  const handleNavigateClose = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Auto-cerrar cuando cambia la ruta en móvil
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Bloquear scroll del body cuando está abierto en móvil
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    if (isOpen && isMobile) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  // Cerrar con tecla Escape en móvil
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [isOpen]);

  // Filtrar enlaces basados en la búsqueda
  const filteredLinks = links.filter(link =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.subItems && link.subItems.some(subItem =>
      subItem.label.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  // Renderizar sub-ítems si existen
  const renderSubItems = (subItems, parentLabel) => {
    if (!expandedItems[parentLabel]) return null;

    return (
      <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
        {subItems.map((subItem) => (
          <NavLink
            key={subItem.path}
            to={subItem.path}
            icon={subItem.icon}
            label={subItem.label}
            isActive={isActive(subItem.path, false)}
            isSubItem
            onNavigate={handleNavigateClose}
          />
        ))}
      </div>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed z-50 p-2.5 rounded-full transition-all duration-300 lg:hidden left-4 top-4",
          "bg-white/90 backdrop-blur-sm shadow-md hover:bg-white",
          "dark:bg-gray-800/90 dark:hover:bg-gray-700",
          isOpen ? "left-64" : "",
          isScrolled ? "top-3" : "top-4"
        )}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-controls="app-sidebar"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-40 h-screen overflow-hidden">
        <aside
          id="app-sidebar"
          className={cn(
            "w-64 h-full pt-16 transition-all duration-300 transform -translate-x-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
            isOpen && "translate-x-0 shadow-xl",
            "lg:translate-x-0 lg:shadow-none"
          )}
          role={window.innerWidth < 1024 ? 'dialog' : undefined}
          aria-modal={isOpen && window.innerWidth < 1024 ? 'true' : undefined}
          aria-hidden={!isOpen && window.innerWidth < 1024 ? 'true' : undefined}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* User profile */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                    <img
                      className="w-full h-full object-cover"
                      src={user?.avatar || `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(user?.userName || 'U')}`}
                      alt={user?.userName}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(user?.userName || 'U')}`;
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full dark:border-gray-900"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {user?.userName || 'Usuario'}
                  </h1>
                  <h2 className="text-xs font-medium text-gray-900 truncate dark:text-gray-400">
                    {user?.lastName || 'Apellido'}
                  </h2>
                  <h3 className="text-xs font-medium text-gray-900 truncate dark:text-gray-400">
                    {role === 'student' ? 'Estudiante' : role === 'teacher' ? 'Profesor' : 'Administrador'}
                  </h3>
                </div>
              </div>
            </div>

            {/* Search */}


            {/* Navigation */}
            <div className="flex-1 px-2 pb-4 overflow-y-auto">
              <nav className="space-y-1">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map((link) => (
                    <div key={link.path}>
                      <NavLink
                        to={link.path}
                        icon={link.icon}
                        label={link.label}
                        isActive={isActive(link.path, !link.subItems)}
                        notification={link.notification}
                        hasSubItems={!!link.subItems}
                        isExpanded={expandedItems[link.label]}
                        onToggle={() => toggleSubItems(link.label)}
                        onNavigate={handleNavigateClose}
                      />
                      {link.subItems && renderSubItems(link.subItems, link.label)}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No se encontraron resultados
                    </p>
                  </div>
                )}
              </nav>
            </div>

            {/* Bottom section */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={logout}
                className={cn(
                  "flex items-center w-full p-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
                  "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                )}
              >
                <LogOut className="w-5 h-5 mr-3 text-gray-500" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;

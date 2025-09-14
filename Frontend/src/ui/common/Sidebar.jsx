import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNotification } from "@/contexts/NotificationContext";
import {
  Home,
  Users,
  User,
  BookOpen,
  CodeXml,
  LayoutDashboard,
  GraduationCap,
  BookCopy,
  CalendarDays,
  MessageSquare,
  Menu,
  X,
  Search,
  ChevronDown,
  BarChart2,
  Plus,
} from "lucide-react";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";
import { Logout } from "@mui/icons-material";

// --- Definición de Links por Rol ---
const getApprenticeLinks = () => [
  { path: "/dashboard", icon: Home, label: "Panel" },
  { path: "/mis-cursos", icon: BookOpen, label: "Mis Cursos" },
  { path: "/pagos", icon: CodeXml, label: "Historial de pagos" },
  { path: "/perfil", icon: User, label: "Perfil" },
  { path: "/politica-de-privacidad", icon: User, label: "Política de privacidad" },
];

const getTeacherLinks = () => [
  { path: "/teacher/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    path: "/teacher/courses",
    icon: BookCopy,
    label: "Mis Cursos",
    subItems: [
      { path: "/teacher/courses", icon: BookCopy, label: "Ver Cursos" },
      { path: "/teacher/courses/new", icon: Plus, label: "Crear Curso" },
    ],
  },
  { path: "/teacher/students", icon: GraduationCap, label: "Estudiantes" },
  { path: "/teacher/analytics", icon: BarChart2, label: "Análisis" },
  { path: "/teacher/profile", icon: User, label: "Perfil" },
];

const adminLinks = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Panel" },
  { path: "/admin/usuarios", icon: Users, label: "Usuarios" },
  { path: "/admin/cursos", icon: BookCopy, label: "Cursos" },
  { path: "/admin/agenda", icon: CalendarDays, label: "Agenda" },
  { path: "/admin/perfil", icon: User, label: "Perfil" },
  { path: "/admin/chat", icon: MessageSquare, label: "Chat" },
];

// --- NavLink ---
const NavLink = ({ to, icon: Icon, label, isActive, hasSubItems, isExpanded, isSubItem, onToggle, onNavigate }) => {
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
          isSubItem ? "pl-10 ml-2" : ""
        )}
      >
        {Icon && (
          <div className={cn(
            "flex-shrink-0 w-6 h-6 mr-3 transition-colors duration-200",
            isActive ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <span className="flex-1 text-left font-medium">{label}</span>
        {hasSubItems && (
          <ChevronDown className={cn("w-4 h-4 ml-2 transition-transform duration-200", isExpanded ? "transform rotate-180" : "")} />
        )}
      </div>
    </div>
  );
};

// --- Sidebar ---
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 1024);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, role, isAuthenticated, logout } = useAuth();
  const { showNotification } = useNotification();


  const handleLogout = async () => {
    console.log('=== SIDEBAR: Iniciando logout ===');
    await logout({ redirect: true, redirectTo: "/" });
    showNotification("¡Hasta luego!", "success");
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleSubItems = (label) => {
    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path, exact = true) => exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleNavigateClose = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.name) return user.name;
    return user.email || "Usuario";
  };

  const formatRole = (role) => {
    const normalizedRole = (role || "").toLowerCase();
    const roles = { 
      student: "Estudiante", 
      teacher: "Instructor", 
      instructor: "Instructor",
      admin: "Administrador" 
    };
    return roles[normalizedRole] || "Usuario";
  };

  const getLinksByRole = () => {
    if (!isAuthenticated) return [];
    const userRole = (role || "").toLowerCase();
    // Mapear 'instructor' a 'teacher' para la generación de enlaces
    const normalizedRole = userRole === 'instructor' ? 'teacher' : userRole;
    
    switch (normalizedRole) {
      case "student": return getApprenticeLinks();
      case "teacher": return getTeacherLinks();
      case "admin": return adminLinks;
      default: return [];
    }
  };

  const filteredLinks = getLinksByRole().filter(link =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (link.subItems && link.subItems.some(sub => sub.label.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const renderSubItems = (subItems, parentLabel) => {
    if (!expandedItems[parentLabel]) return null;
    return (
      <div className="mt-2 space-y-1 border-l-2 border-indigo-200 ml-4 pl-4">
        {subItems.map(sub => (
          <NavLink
            key={sub.path}
            to={sub.path}
            icon={sub.icon}
            label={sub.label}
            isActive={isActive(sub.path)}
            isSubItem
            onNavigate={handleNavigateClose}
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
        className={cn("fixed z-50 p-2.5 rounded-full bg-white/90 shadow-md lg:hidden left-4 top-4", isOpen ? "left-64" : "", isScrolled ? "top-3" : "top-4")}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && window.innerWidth < 1024 && <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <div className="fixed top-0 left-0 z-40 h-screen overflow-hidden">
        <aside
          className={cn(
            "w-64 h-full pt-16 transition-transform duration-300 transform -translate-x-full bg-white border-r border-gray-200",
            isOpen ? "translate-x-0 shadow-xl" : "",
            "lg:translate-x-0 lg:shadow-none"
          )}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Perfil */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold">
                    {getUserDisplayName().charAt(0).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-sm font-medium truncate">{getUserDisplayName()}</h1>
                  <h2 className="text-xs text-gray-500">{formatRole(role)}</h2>
                </div>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Navegación */}
            <div className="flex-1 px-3 pb-4 overflow-y-auto">
              <nav className="space-y-2 mt-4">
                {filteredLinks.length > 0 ? (
                  filteredLinks.map(link => (
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
                      />
                      {link.subItems && renderSubItems(link.subItems, link.label)}
                    </div>
                  ))
                ) : (
                  <p className="px-2 py-2 text-sm text-gray-500">No hay enlaces disponibles</p>
                )}
              </nav>
            </div>
             {/* Cerrar sesión */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Logout className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;

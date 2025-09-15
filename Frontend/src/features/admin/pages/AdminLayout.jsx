import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, BookOpen, BarChart2, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';
import Sidebar from '@/ui/common/Sidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, current: location.pathname === '/admin' },
    { name: 'Usuarios', href: '/admin/usuarios', icon: Users, current: location.pathname.startsWith('/admin/usuarios') },
    { name: 'Cursos', href: '/admin/cursos', icon: BookOpen, current: location.pathname.startsWith('/admin/cursos') },
    { name: 'Reportes', href: '/admin/reportes', icon: BarChart2, current: location.pathname.startsWith('/admin/reportes') },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const {logout} = useAuth();

  const handleLogout = () => {
    logout();
    // Implement logout logic here
    navigate('/login');
  };

  const getPageTitle = () => {
    const currentNav = navigation.find(item => item.current);
    if (currentNav) return currentNav.name;
    
    // For subroutes not in the main menu
    if (location.pathname.includes('/admin/usuarios')) return 'Gestión de Usuarios';
    if (location.pathname.includes('/admin/cursos')) return 'Gestión de Cursos';
    if (location.pathname.includes('/admin/reportes')) return 'Reportes y Análisis';
    
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-100">
    <Sidebar/>  

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden md:pl-20">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold">
                    A
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

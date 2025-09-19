import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import { LogOut, User } from "lucide-react";
export default function HeaderApp() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dropdownRef = useRef(null);

  const getPageTitle = () => {
    // For subroutes not in the main menu
    if (location.pathname.includes("/admin/usuarios"))
      return "Gestión de Usuarios";
    if (location.pathname.includes("/admin/cursos")) return "Gestión de Cursos";
    if (location.pathname.includes("/admin/reportes"))
      return "Reportes y Análisis";
    if (location.pathname.includes("/mis-cursos"))
      return "Mis cursos";
    if (location.pathname.includes("/perfil"))
      return "Mi perfil";
    if (location.pathname.includes("/configuracion"))
      return "Configuración";
    if (location.pathname.includes("/dashboard"))

    return "Dashboard";
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowConfirmDialog(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowConfirmDialog(false);
    setIsDropdownOpen(false);
  };
  const image = user.profileImageUrl ? user.profileImageUrl : "https://ui-avatars.com/api/?name=" + user.firstName + "+" + user.lastName;

  const getUserDisplayName = () => {
    if (!user) return "Usuario";
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.name) return user.name;
    return user.email || "Usuario";

  };
  return (
    <header className="bg-white shadow-sm px-6">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <h2 className="text-xl font-semibold text-gray-800 ml-4">
          {getPageTitle()}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:bg-gray-50 transition-colors">
              <span className="sr-only">Abrir menú de usuario</span>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold">
                <img src={image} alt={getUserDisplayName()} className="w-8 h-8 rounded-full" />
                {/* {getUserDisplayName().charAt(0).toUpperCase()} */}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                  <LogOut className="w-4 h-4 mr-3" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <LogOut className="w-5 h-5 text-red-600" />
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
    </header>
  );
}

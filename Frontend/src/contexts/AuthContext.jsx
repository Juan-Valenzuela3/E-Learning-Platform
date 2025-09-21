// src/context/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { ROLE_PERMISSIONS } from "@/shared/constants/roles";
import authService from "@/services/authService";
import { setupResponseInterceptors, removeResponseInterceptors } from "@/services/authInterceptor";
import api from "@/services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children, onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onLogoutCallback, setOnLogoutCallback] = useState(() => onLogout);

  // Callback para logout personalizado
  const setLogoutCallback = useCallback((callback) => {
    setOnLogoutCallback(() => callback);
  }, []);

  // Configurar interceptores de respuesta
  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      if (onLogoutCallback) onLogoutCallback();
    };
    setupResponseInterceptors(handleLogout);
    
    // Cleanup function to remove interceptors
    return () => {
      removeResponseInterceptors();
    };
  }, [onLogoutCallback]);

  // Verificar autenticación al cargar el contexto
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (!isMounted) return;
      setLoading(true);

      try {
        const token = authService.getToken();
        console.log(
          "Token encontrado en localStorage:",
          token ? "***" + token.slice(-10) : "No hay token"
        );

        if (!token) {
          setLoading(false);
          return;
        }

        // Validar token con servidor usando la función optimizada
        const response = await authService.validateToken();

        if (!response?.valid) {
          console.log("Token inválido según el servidor, cerrando sesión...");
          authService.logout();
          setUser(null);
        } else {
          // Token válido, obtener datos del usuario
          const userData = await authService.getCurrentUser();
          if (isMounted) setUser(userData);
        }
      } catch (error) {
        console.error("Error al validar token:", error);
        setError("Error al verificar la sesión");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login
  const login = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const { token, user } = userData;
      if (!token || !user) throw new Error("Datos de usuario inválidos");

      setUser(user);
      authService.setToken(token);

      // Actualizar headers de axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true, data: user, token };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(error.message || "Error de autenticación");
      authService.logout();
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(
    async (options = {}) => {
      try {
        console.log("=== AUTH CONTEXT: Iniciando logout ===");
        console.log("Options:", options);

        // Limpiar token y datos del usuario
        authService.logout();
        setUser(null);
        setError(null);

        // Limpiar headers de axios
        delete api.defaults.headers.common["Authorization"];

        // Solo redirigir si no se especifica lo contrario
        if (options.redirect !== false) {
          let redirectTo = "/authentication/login";
          if (options.redirectTo) redirectTo = options.redirectTo;
          else if (onLogoutCallback) {
            const result = onLogoutCallback();
            if (result) redirectTo = result;
          }

          console.log("=== AUTH CONTEXT: Redirigiendo a ===", redirectTo);
          // Usar window.location.href solo si es necesario
          if (redirectTo) {
            window.location.href = redirectTo;
          }
        }

        return { success: true };
      } catch (error) {
        console.error("Error durante logout:", error);
        return { success: false, error };
      }
    },
    [onLogoutCallback]
  );

  // Registro
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role || "STUDENT",
      });

      // authService.register() hace auto-login, así que response ya contiene datos del usuario
      if (response?.id) {
        // Establecer el usuario como autenticado
        setUser(response);

        // Actualizar headers de axios
        const token = authService.getToken();
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        return { success: true, data: response, autoLogin: true };
      }

      return { success: false, error: "No se pudo completar el registro" };
    } catch (error) {
      console.error("Error de registro:", error);
      const errorMessage = error.message || "Error al registrar el usuario";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Permisos
  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
  };

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profile = await authService.getCurrentUser();
      setUser(profile);
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Error al cargar perfil");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await authService.updateProfile(updates);
      setUser((prev) => ({ ...prev, ...updatedProfile }));
      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error al actualizar perfil");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role || "guest",
    login,
    logout,
    register,
    hasPermission,
    setLogoutCallback,
    fetchProfile,
    updateProfile,
    setError,
  }), [user, loading, error, login, logout, register, hasPermission, setLogoutCallback, fetchProfile, updateProfile, setError]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  onLogout: PropTypes.func,
};

export default AuthContext;

// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import mockAuthService from "@/interfaces/api/__mocks__/mockAuthService";
import { ROLE_PERMISSIONS } from "@/shared/constants/roles";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onLogoutCallback, setOnLogoutCallback] = useState(null);

  // Set a callback to be called on logout
  const setLogoutCallback = useCallback((callback) => {
    setOnLogoutCallback(() => callback);
  }, []);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (mockAuthService.isAuthenticated()) {
          const userData = mockAuthService.getCurrentUser();
          if (userData) {
            setUser({
              token: mockAuthService.getToken(),
              ...userData,
              role: userData.role || 'student',
              name: userData.userName || 'Usuario',
              lastName: userData.lastName || '',
              avatar: userData.avatar || '',
              email: userData.email
            });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const loggedUser = await mockAuthService.login(email, password);
      if (loggedUser && loggedUser.token) {
        const userData = {
          ...loggedUser,
          role: loggedUser.role || 'student',
          name: loggedUser.userName || 'Usuario',
          lastName: loggedUser.lastName || '',
          avatar: loggedUser.avatar || '',
          email: loggedUser.email
        };
        setUser(userData);
        return userData;
      }
      throw new Error("Invalid response from authentication service");
    } catch (error) {
      console.error("Login error:", error);
      if (!error.response) {
        error.response = { data: { message: error.message || "Authentication failed" } };
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    mockAuthService.logout();
    setUser(null);
    // llamadas a la funcion de logout para redirigir al login
    if (onLogoutCallback) {
      onLogoutCallback();
    }
  }, [onLogoutCallback]);

  const hasPermission = (permission) => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role]?.[permission] ?? false;
  };

  // contexto para manejar el perfil del usuario con la api de mock se cambia por la api de backend
  // fetchProfile como funcion se encarga de obtener los datos de los usuarios autenticados
  const fetchProfile = async () => {
    const profile = await mockAuthService.getProfile();
    // actualiza el contexto del usuario
    setUser((prev) => prev ? { ...prev, name: profile.name, email: profile.email, role: profile.role } : prev);
    return profile;
  };

  const updateProfile = async (updates) => {
    const updated = await mockAuthService.updateProfile(updates);
    // actualiza el contexto del usuario
    setUser((prev) => prev ? { ...prev, name: updated.name, email: updated.email } : prev);
    return updated;
  };
  // isAuthenticated es una funcion que retorna true si el usuario esta autenticado
  const isAuthenticated = !!user;
  // role es una funcion que retorna el rol del usuario
  const role = user?.role || 'guest';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      role,
      login,
      logout,
      setLogoutCallback,
      hasPermission,
      fetchProfile,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

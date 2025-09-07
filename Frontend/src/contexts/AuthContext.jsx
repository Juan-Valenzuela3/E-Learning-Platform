import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => {
    // Aquí pondrías llamada a tu API
    if (email && password) {
      setUser({ email }); // Simulación de login
    }
  };

  const logout = () => setUser(null);

  const register = ({ email, password }) => {
    // Simulación de registro
    setUser({ email });
    setUser({ password })
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

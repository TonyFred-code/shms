import { useState } from "react";
import { authService } from "../services/authService.js";
import AuthContext from "./authContext.jsx";
import { element } from "prop-types";
import { clearSession, getStoredSession, saveSession } from "../lib/session.js";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSession());

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
      saveSession(result.user);
    }
    return result;
  };

  const register = async (data) => {
    const result = await authService.register(data);
    if (result.success) {
      setUser(result.user);
      saveSession(result.user);
    }
    return result;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: element.isRequired,
};

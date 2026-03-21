// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../api";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("ssa_token");
    if (!t) { setLoading(false); return; }
    authApi.getMe()
      .then(r => setUser(r.user))
      .catch(() => localStorage.removeItem("ssa_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const r = await authApi.login(email, password);
    localStorage.setItem("ssa_token", r.token);
    setUser(r.user);
    return r;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const r = await authApi.register(name, email, password);
    localStorage.setItem("ssa_token", r.token);
    setUser(r.user);
    return r;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ssa_token");
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const r = await authApi.updateProfile(data);
    setUser(r.user);
    return r;
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
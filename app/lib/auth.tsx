import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import { getProfile, logout as apiLogout, setToken } from "./api";
import type { Profile } from "./types";

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getProfile()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginFn = useCallback(async (token: string) => {
    setToken(token);
    const profile = await getProfile();
    setUser(profile);
  }, []);

  const logoutFn = useCallback(async () => {
    try { await apiLogout(); } catch {}
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login: loginFn, logout: logoutFn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

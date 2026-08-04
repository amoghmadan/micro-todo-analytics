import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fetchSession, postAction } from "./api";
import type { Profile } from "./types";

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession()
      .then((session) => setUser(session.authenticated ? session.user : null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(async () => {
    try {
      const session = await fetchSession();
      setUser(session.authenticated ? session.user : null);
    } catch {
      setUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await postAction("logout", {});
    } catch {
      // Session may already be gone; clear the client state regardless.
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

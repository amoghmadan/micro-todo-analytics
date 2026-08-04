import { Navigate } from "react-router";
import { useAuth } from "../lib/auth";
import { ScreenPage } from "../lib/screen-page";

export function meta() {
  return [{ title: "Login - Micro Todo Analytics" }];
}

export default function Login() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return <ScreenPage screen="login" />;
}

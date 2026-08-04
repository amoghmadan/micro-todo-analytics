import { Navigate } from "react-router";
import { useAuth } from "../lib/auth";
import { ScreenPage } from "../lib/screen-page";

export function meta() {
  return [{ title: "Register - Micro Todo Analytics" }];
}

export default function Register() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return <ScreenPage screen="register" />;
}

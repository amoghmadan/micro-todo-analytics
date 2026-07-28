import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../lib/auth";

export function meta() {
  return [{ title: "Micro Todo Analytics" }];
}

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      navigate(user ? "/dashboard" : "/login", { replace: true });
    }
  }, [user, loading, navigate]);

  return null;
}

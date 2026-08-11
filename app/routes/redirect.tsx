import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    let disposed = false;
    if (!disposed) {
      navigate("/home", { replace: true });
    }
    return () => {
      disposed = true;
    };
  }, [navigate]);

  return null;
}

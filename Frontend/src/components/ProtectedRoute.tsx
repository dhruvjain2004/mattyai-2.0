import { useEffect, useState } from "react";
import Login from "@/pages/Login";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let authed = false;
    let authorized = false;
    if (token) {
      authed = true;
      if (requireAdmin) {
        const stored = localStorage.getItem("user");
        const role = stored ? (JSON.parse(stored)?.role as string | undefined) : undefined;
        authorized = role === "admin";
      } else {
        authorized = true;
      }
    }
    setIsAuthenticated(authed);
    setIsAuthorized(authorized);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAuthorized) {
    return <Login />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

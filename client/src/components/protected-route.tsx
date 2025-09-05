import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Add a small delay to allow authentication state to settle
    const checkAuth = () => {
      if (!isAuthenticated || (requireAdmin && !isAdmin)) {
        setLocation("/admin/login");
      }
    };

    // Check immediately
    checkAuth();
    
    // Also check after a short delay to handle race conditions
    const timeoutId = setTimeout(checkAuth, 50);
    
    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, isAdmin, requireAdmin, setLocation]);

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
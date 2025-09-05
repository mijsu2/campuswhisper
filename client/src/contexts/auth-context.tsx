import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: { id: string; username: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem("admin_authenticated");
    const storedUser = localStorage.getItem("admin_user");
    if (storedAuth === "true" && storedUser) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Set state synchronously
        const userData = data.user;
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(true);
        
        // Store in localStorage
        localStorage.setItem("admin_authenticated", "true");
        localStorage.setItem("admin_user", JSON.stringify(userData));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_user");
  };

  const changePassword = async (newPassword: string): Promise<boolean> => {
    try {
      if (!user) return false;

      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          newPassword 
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Password change error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
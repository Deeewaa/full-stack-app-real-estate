import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userId: number, userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Verify the user still exists on the server
          try {
            const response = await fetch(`/api/users/${userData.id}`);
            if (response.ok) {
              setUser(userData);
            } else {
              // If the user doesn't exist anymore, clear local storage
              localStorage.removeItem("user");
              localStorage.removeItem("userId");
              localStorage.removeItem("userType");
            }
          } catch (error) {
            console.error("Failed to verify user:", error);
            // Don't clear storage on network errors to allow offline access
          }
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Login Failed",
          description: error.message || "Invalid username or password",
          variant: "destructive",
        });
        throw new Error(error.message || "Login failed");
      }
      
      const userData = await response.json();
      
      // Store user in state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id.toString());
      localStorage.setItem("userType", userData.userType);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.fullName || userData.username}!`,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      
      // Make sure confirmPassword is included in the API request
      if (!userData.confirmPassword && userData.password) {
        userData.confirmPassword = userData.password;
      }
      
      const response = await apiRequest("POST", "/api/users/register", userData);
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Registration Failed",
          description: error.message || "Failed to create account",
          variant: "destructive",
        });
        throw new Error(error.message || "Registration failed");
      }
      
      const newUser = await response.json();
      
      // Store user in state and localStorage
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("userId", newUser.id.toString());
      localStorage.setItem("userType", newUser.userType);
      
      toast({
        title: "Registration Successful",
        description: `Welcome to Realty Estate, ${newUser.fullName || newUser.username}!`,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userId: number, userData: Partial<User>) => {
    try {
      setIsLoading(true);
      const response = await apiRequest("PATCH", `/api/users/${userId}`, userData);
      
      if (!response.ok) {
        const error = await response.json();
        toast({
          title: "Update Failed",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        });
        throw new Error(error.message || "Profile update failed");
      }
      
      const updatedUser = await response.json();
      
      // Update user in state and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      return updatedUser;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Named export to follow React fast refresh rules
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
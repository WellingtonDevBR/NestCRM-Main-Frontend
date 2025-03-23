
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isOnDashboardSubdomain } from "@/utils/subdomain";
import { useDashboardData } from "./useDashboardData";

// Types for user data
interface User {
  id: string;
  name: string;
  email: string;
  company: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth(): AuthState {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });
  
  // Use dashboard data to determine authentication status
  const { data, isLoading, error, isError } = useDashboardData();
  
  useEffect(() => {
    if (!isLoading) {
      if (data) {
        // If we successfully got dashboard data, the user is authenticated
        setAuthState({
          isAuthenticated: true,
          user: data.user || null, // Extract user from dashboard data if available
          loading: false,
          error: null,
        });
      } else if (isError) {
        // Authentication failed
        if (isOnDashboardSubdomain()) {
          toast.error("Your session has expired. Please log in again.");
          
          // Only redirect if we're not already in the process of handling an auth error
          if (window.location.pathname !== "/login") {
            window.location.href = "https://nestcrm.com.au/login";
          }
        }
        
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: error as Error,
        });
      }
    }
  }, [data, isLoading, error, isError, navigate]);

  return authState;
}

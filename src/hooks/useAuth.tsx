
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isOnDashboardSubdomain } from "@/utils/subdomain";

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
  
  // Check authentication status
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        // Use suppressToast to avoid duplicate toasts
        const result = await api.get<{ user: User }>("/auth/status", undefined, true);
        return result.user;
      } catch (err) {
        // If not authenticated and on subdomain, go back to main site
        if (isOnDashboardSubdomain()) {
          // Don't show error toast here as the api utility already does
          if (err instanceof Error && err.message !== "Authentication failed") {
            toast.error("Authentication required. Please log in again.");
          }
          // Only redirect if we're not already in the process of handling an auth error
          if (window.location.pathname !== "/login") {
            window.location.href = "https://nestcrm.com.au/login";
          }
        }
        throw err;
      }
    },
    // Don't retry too many times to avoid spamming the server
    retry: 1,
    // Always run this query when on dashboard subdomain
    enabled: isOnDashboardSubdomain(),
  });

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error("Authentication error:", error);
      // Only show toast if it's not already an auth error (which is handled in the API utility)
      if (error instanceof Error && error.message !== "Authentication failed") {
        toast.error("Your session has expired. Please log in again.");
      }
      
      // Only redirect if we're not already in the process of handling an auth error
      if (window.location.pathname !== "/login") {
        window.location.href = "https://nestcrm.com.au/login";
      }
    }
  }, [error]);

  // Set default state
  const authState: AuthState = {
    isAuthenticated: !!data,
    user: data || null,
    loading: isLoading,
    error: error as Error | null,
  };

  return authState;
}

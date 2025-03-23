
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
        const result = await api.get<{ user: User }>("/auth/status");
        return result.user;
      } catch (err) {
        // If not authenticated and on subdomain, go back to main site
        if (isOnDashboardSubdomain()) {
          toast.error("Authentication required");
          window.location.href = "https://nestcrm.com.au/login";
        }
        throw err;
      }
    },
    // Don't retry too many times to avoid spamming the server
    retry: 1,
    // Only run this query on dashboard subdomain
    enabled: isOnDashboardSubdomain(),
  });

  // Set default state
  const authState: AuthState = {
    isAuthenticated: !!data,
    user: data || null,
    loading: isLoading,
    error: error as Error | null,
  };

  return authState;
}

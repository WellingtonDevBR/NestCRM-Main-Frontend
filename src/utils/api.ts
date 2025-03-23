
import { toast } from "sonner";

// Base API URL - defaults to current domain
const API_BASE_URL = `${window.location.origin}/api`;

/**
 * Custom API client for making authenticated requests to the backend
 */
interface ApiOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Makes an authenticated API request to the backend
 * Automatically includes credentials for cookies
 */
export async function apiRequest<T>({
  endpoint,
  method = "GET",
  body = undefined,
  headers = {},
}: ApiOptions): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    // Create fetch options with credentials to include cookies
    const options: RequestInit = {
      method,
      credentials: "include", // This is crucial for sending cookies
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Add body for non-GET requests
    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    // Make the request
    const response = await fetch(url, options);
    
    // Handle non-2xx responses
    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: "An unknown error occurred" };
      }
      
      // Handle auth errors specially
      if (response.status === 401) {
        toast.error("Session expired. Please log in again.");
        // Redirect to login if needed
        window.location.href = "https://nestcrm.com.au/login";
        throw new Error("Authentication failed");
      }
      
      throw new Error(errorData.message || "Request failed");
    }

    // Parse and return JSON data
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API request failed:", error);
    // Re-throw to allow handling by the caller
    throw error;
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) => 
    apiRequest<T>({ endpoint, method: "GET", headers }),
  
  post: <T>(endpoint: string, body: any, headers?: Record<string, string>) => 
    apiRequest<T>({ endpoint, method: "POST", body, headers }),
  
  put: <T>(endpoint: string, body: any, headers?: Record<string, string>) => 
    apiRequest<T>({ endpoint, method: "PUT", body, headers }),
  
  delete: <T>(endpoint: string, headers?: Record<string, string>) => 
    apiRequest<T>({ endpoint, method: "DELETE", headers }),
};

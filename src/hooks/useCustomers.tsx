
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define types
export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  customFields?: {
    [key: string]: string;
  };
}

export interface CustomerCreateInput {
  name: string;
  email: string;
  customFields?: {
    [key: string]: string;
  };
}

// Mock data to use until backend is integrated
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Acme Corp",
    email: "contact@acmecorp.com",
    createdAt: new Date().toISOString(),
    customFields: {
      industry: "Technology",
      employeeCount: "250",
      subscription: "Enterprise"
    }
  },
  {
    id: "2",
    name: "Globex Industries",
    email: "info@globex.com",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    customFields: {
      industry: "Manufacturing",
      yearFounded: "1989",
      annualRevenue: "$4.5M"
    }
  },
  {
    id: "3",
    name: "Wayne Enterprises",
    email: "bruce@wayne.com",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    customFields: {
      industry: "Technology",
      headquarters: "Gotham",
      ceo: "Bruce Wayne"
    }
  }
];

// Mock localStorage functions to simulate API
const getStoredCustomers = (): Customer[] => {
  try {
    const stored = localStorage.getItem("nestcrm_customers");
    return stored ? JSON.parse(stored) : MOCK_CUSTOMERS;
  } catch (e) {
    console.error("Error reading customers from localStorage:", e);
    return MOCK_CUSTOMERS;
  }
};

const storeCustomers = (customers: Customer[]): void => {
  try {
    localStorage.setItem("nestcrm_customers", JSON.stringify(customers));
  } catch (e) {
    console.error("Error storing customers in localStorage:", e);
  }
};

// Initialize localStorage with mock data if empty
if (!localStorage.getItem("nestcrm_customers")) {
  storeCustomers(MOCK_CUSTOMERS);
}

export function useCustomers() {
  const queryClient = useQueryClient();
  
  // Fetch customers
  const {
    data: customers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        // In a real app, we'd use the API here
        // return await api.get<Customer[]>("/customers");
        
        // For now, use localStorage
        return getStoredCustomers();
      } catch (err) {
        console.error("Error fetching customers:", err);
        throw err;
      }
    }
  });

  // Add a new customer
  const { mutateAsync: addCustomer } = useMutation({
    mutationFn: async (newCustomer: CustomerCreateInput) => {
      try {
        // In a real app, we'd use the API here
        // return await api.post<Customer>("/customers", newCustomer);
        
        // For now, use localStorage
        const currentCustomers = getStoredCustomers();
        const customerToAdd: Customer = {
          id: Date.now().toString(),
          ...newCustomer,
          createdAt: new Date().toISOString()
        };
        
        const updatedCustomers = [...currentCustomers, customerToAdd];
        storeCustomers(updatedCustomers);
        return customerToAdd;
      } catch (err) {
        console.error("Error adding customer:", err);
        throw err;
      }
    },
    onSuccess: () => {
      // Invalidate the customers query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });

  // Update a customer
  const { mutateAsync: updateCustomer } = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & CustomerCreateInput) => {
      try {
        // In a real app, we'd use the API here
        // return await api.put<Customer>(`/customers/${id}`, updateData);
        
        // For now, use localStorage
        const currentCustomers = getStoredCustomers();
        const customerIndex = currentCustomers.findIndex(c => c.id === id);
        
        if (customerIndex === -1) {
          throw new Error("Customer not found");
        }
        
        const updatedCustomer = {
          ...currentCustomers[customerIndex],
          ...updateData
        };
        
        const updatedCustomers = [...currentCustomers];
        updatedCustomers[customerIndex] = updatedCustomer;
        storeCustomers(updatedCustomers);
        return updatedCustomer;
      } catch (err) {
        console.error("Error updating customer:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });

  // Delete a customer
  const { mutateAsync: deleteCustomer } = useMutation({
    mutationFn: async (id: string) => {
      try {
        // In a real app, we'd use the API here
        // return await api.delete(`/customers/${id}`);
        
        // For now, use localStorage
        const currentCustomers = getStoredCustomers();
        const updatedCustomers = currentCustomers.filter(c => c.id !== id);
        storeCustomers(updatedCustomers);
        return { success: true };
      } catch (err) {
        console.error("Error deleting customer:", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
}

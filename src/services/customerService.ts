
import { Customer, CustomerFormData } from "@/domain/models/customer";

// Mock data to use until backend is integrated
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "Acme Corp",
    email: "contact@acmecorp.com",
    phone: "123-456-7890",
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
    phone: "987-654-3210",
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
    phone: "555-555-5555",
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
if (typeof window !== 'undefined' && !localStorage.getItem("nestcrm_customers")) {
  storeCustomers(MOCK_CUSTOMERS);
}

export interface CustomerCreateInput extends Omit<Customer, 'id' | 'createdAt'> {}

export const customerService = {
  // Fetch all customers
  getCustomers: async (): Promise<Customer[]> => {
    try {
      // In a real app, we'd use the API here
      // return await api.get<Customer[]>("/api/customers");
      return getStoredCustomers();
    } catch (err) {
      console.error("Error fetching customers:", err);
      throw err;
    }
  },

  // Create a new customer
  createCustomer: async (newCustomer: CustomerFormData): Promise<Customer> => {
    try {
      // In a real app, we'd use the API here
      // return await api.post<Customer>("/api/customers", newCustomer);
      
      const customerToAdd: Customer = {
        id: Date.now().toString(),
        ...newCustomer,
        createdAt: new Date().toISOString()
      };
      
      const updatedCustomers = [...getStoredCustomers(), customerToAdd];
      storeCustomers(updatedCustomers);
      return customerToAdd;
    } catch (err) {
      console.error("Error adding customer:", err);
      throw err;
    }
  },

  // Update an existing customer
  updateCustomer: async (id: string, updateData: CustomerFormData): Promise<Customer> => {
    try {
      // In a real app, we'd use the API here
      // return await api.put<Customer>(`/api/customers/${id}`, updateData);
      
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

  // Delete a customer
  deleteCustomer: async (id: string): Promise<{ success: boolean }> => {
    try {
      // In a real app, we'd use the API here
      // return await api.delete(`/api/customers/${id}`);
      
      const currentCustomers = getStoredCustomers();
      const updatedCustomers = currentCustomers.filter(c => c.id !== id);
      storeCustomers(updatedCustomers);
      return { success: true };
    } catch (err) {
      console.error("Error deleting customer:", err);
      throw err;
    }
  }
};


import { Customer, CustomerFormData, CustomerApiResponse, CustomerApiRequest } from "@/domain/models/customer";
import { api } from "@/utils/api";

// Convert API response to domain model
const mapFromApiResponse = (apiCustomer: CustomerApiResponse): Customer => {
  return {
    id: apiCustomer.CustomerID,
    name: apiCustomer.Name,
    email: apiCustomer.Email,
    phone: apiCustomer.Phone,
    createdAt: apiCustomer.CreatedAt,
    customFields: apiCustomer.CustomFields
  };
};

// Convert domain model to API request format
const mapToApiRequest = (customerData: CustomerFormData): CustomerApiRequest => {
  return {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    customFields: customerData.customFields || {}
  };
};

export const customerService = {
  // Fetch all customers
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<CustomerApiResponse[]>("/customer");
      return response.map(mapFromApiResponse);
    } catch (err) {
      console.error("Error fetching customers:", err);
      throw err;
    }
  },

  // Create a new customer
  createCustomer: async (newCustomer: CustomerFormData): Promise<Customer> => {
    try {
      const apiRequest = mapToApiRequest(newCustomer);
      const response = await api.post<CustomerApiResponse>("/customer", apiRequest);
      return mapFromApiResponse(response);
    } catch (err) {
      console.error("Error adding customer:", err);
      throw err;
    }
  },

  // Update an existing customer
  updateCustomer: async (id: string, updateData: CustomerFormData): Promise<Customer> => {
    try {
      const apiRequest = mapToApiRequest(updateData);
      const response = await api.put<CustomerApiResponse>(`/customer/${id}`, apiRequest);
      return mapFromApiResponse(response);
    } catch (err) {
      console.error("Error updating customer:", err);
      throw err;
    }
  },

  // Delete a customer
  deleteCustomer: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`/customer/${id}`);
      return { success: true };
    } catch (err) {
      console.error("Error deleting customer:", err);
      throw err;
    }
  }
};

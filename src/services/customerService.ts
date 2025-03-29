
import { Customer, CustomerFormData, CustomerApiResponse, CustomerApiRequest, CustomerAssociations } from "@/domain/models/customer";
import { api } from "@/utils/api";

// Convert API response to domain model
const mapFromApiResponse = (apiCustomer: CustomerApiResponse): Customer => {
  // Extract standard fields
  const customer: Customer = {
    id: apiCustomer.CustomerID,
    name: apiCustomer.Name || "",
    email: apiCustomer.Email || "",
    phone: apiCustomer.Phone || "",
    createdAt: apiCustomer.CreatedAt,
    customFields: apiCustomer.CustomFields || {}
  };
  
  return customer;
};

// Convert domain model to API request format
const mapToApiRequest = (customerData: CustomerFormData, customerId?: string, customerEmail?: string): CustomerApiRequest => {
  const associations: CustomerAssociations = {};
  
  // Check for appropriate fields in customFields and add to associations
  if (customerData.customFields["customer_id"]) {
    associations.customer_id = String(customerData.customFields["customer_id"]);
  } else if (customerId) {
    // Fallback to passed customerId parameter if available
    associations.customer_id = customerId;
  }
  
  // Check for "email" in customFields and add to associations
  if (customerData.customFields["email"]) {
    associations.email = String(customerData.customFields["email"]);
  } else if (customerData.email) {
    // Fallback to direct email field if available
    associations.email = customerData.email;
  } else if (customerEmail) {
    // Fallback to passed customerEmail parameter if available
    associations.email = customerEmail;
  }
  
  // Only include non-empty values in customFields
  const customFields: Record<string, string | number | null> = {};
  
  // Copy all custom fields that have values, using the field keys
  Object.entries(customerData.customFields).forEach(([key, value]) => {
    if (value !== null && value !== "") {
      customFields[key] = value;
    }
  });
  
  // Add standard fields only if they have values
  if (customerData.name) {
    customFields.Name = customerData.name;
  }
  
  if (customerData.email) {
    customFields.Email = customerData.email;
  }
  
  if (customerData.phone) {
    customFields.Phone = customerData.phone;
  }
  
  return {
    customFields,
    associations
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
      console.log("Customer create request payload:", apiRequest);
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
      const apiRequest = mapToApiRequest(updateData, id);
      console.log("Customer update request payload:", apiRequest);
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

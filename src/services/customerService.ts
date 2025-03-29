
import { Customer, CustomerFormData, CustomerApiResponse, CustomerApiRequest, CustomerAssociations } from "@/domain/models/customer";
import { api } from "@/utils/api";

// Convert API response to domain model
const mapFromApiResponse = (apiCustomer: CustomerApiResponse): Customer => {
  console.log("Mapping API customer:", apiCustomer);
  
  // Extract standard fields
  const customer: Customer = {
    id: apiCustomer.CustomerID,
    name: apiCustomer.Name || "",
    email: apiCustomer.Email || "",
    phone: apiCustomer.Phone || "",
    createdAt: apiCustomer.CreatedAt,
    customFields: {}
  };
  
  // First, copy all custom fields directly from the API response
  if (apiCustomer.customFields) {
    console.log("API provided customFields:", apiCustomer.customFields);
    Object.assign(customer.customFields, apiCustomer.customFields);
  }
  
  // For backward compatibility, check for the old structure with uppercase "CustomFields"
  if (apiCustomer.CustomFields) {
    console.log("API provided CustomFields (uppercase):", apiCustomer.CustomFields);
    Object.assign(customer.customFields, apiCustomer.CustomFields);
  }
  
  // Make sure association fields are included in customFields
  if (apiCustomer.associations) {
    console.log("API provided associations:", apiCustomer.associations);
    
    if (apiCustomer.associations.id && !customer.customFields.id) {
      customer.customFields.id = apiCustomer.associations.id;
    }
    
    if (apiCustomer.associations.email && !customer.customFields.email) {
      customer.customFields.email = apiCustomer.associations.email;
    }
  }
  
  // If CustomerID is not in customFields, add it with the key "id"
  if (apiCustomer.CustomerID && !customer.customFields.id) {
    customer.customFields.id = apiCustomer.CustomerID;
  }
  
  // Add standard fields to customFields for consistent display in the table
  if (apiCustomer.Name && !customer.customFields.name) {
    customer.customFields.name = apiCustomer.Name;
  }
  
  if (apiCustomer.Email && !customer.customFields.email) {
    customer.customFields.email = apiCustomer.Email;
  }
  
  if (apiCustomer.Phone && !customer.customFields.phone) {
    customer.customFields.phone = apiCustomer.Phone;
  }
  
  console.log("Mapped to domain customer:", customer);
  return customer;
};

// Convert domain model to API request format
const mapToApiRequest = (customerData: CustomerFormData, customerId?: string, customerEmail?: string): CustomerApiRequest => {
  const associations: CustomerAssociations = {};
  
  // Check for appropriate fields in customFields and add to associations
  if (customerData.customFields["id"]) {
    associations.id = String(customerData.customFields["id"]);
  } else if (customerId) {
    // Fallback to passed customerId parameter if available
    associations.id = customerId;
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
    customFields.name = customerData.name;
  }
  
  if (customerData.email) {
    customFields.email = customerData.email;
  }
  
  if (customerData.phone) {
    customFields.phone = customerData.phone;
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
      console.log("API response from GET /customer:", response);
      const mappedCustomers = response.map(mapFromApiResponse);
      console.log("Mapped customers:", mappedCustomers);
      return mappedCustomers;
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

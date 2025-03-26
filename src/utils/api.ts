
// Basic API utilities
interface ApiOptions {
  headers?: Record<string, string>;
}

// Mock data for custom fields
const mockCustomFields = {
  "Order": [
    {
      "label": "Order ID",
      "type": "text",
      "key": "Order_ID",
      "required": true
    }
  ],
  "Payment": [
    {
      "label": "Total Amount",
      "type": "number",
      "key": "Total_Amount",
      "required": true
    },
    {
      "label": "Payment ID",
      "type": "text",
      "key": "Payment_ID",
      "required": true
    }
  ],
  "Customer": [
    {
      "label": "Salary",
      "type": "number",
      "key": "Salary",
      "required": true
    }
  ],
  "Interaction": [],
  "Support": []
};

// Simple API client for making HTTP requests
export const api = {
  // GET request
  async get<T>(url: string, options?: ApiOptions): Promise<T> {
    console.log(`API GET request to ${url}`);
    
    // Mock API response for custom fields
    if (url.includes('/settings/custom-fields')) {
      console.log("Mocking API response for custom fields GET:", mockCustomFields);
      // Return mock data for custom fields
      return mockCustomFields as unknown as T;
    }

    // Implement actual API call logic here
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // POST request
  async post<T>(url: string, data: any, options?: ApiOptions): Promise<T> {
    console.log(`API POST request to ${url} with data:`, data);
    
    // Mock API response for custom fields update
    if (url.includes('/settings/custom-fields')) {
      console.log("Mocking API response for custom fields POST:", data);
      // Update mock data and return it
      const category = Object.keys(data)[0];
      mockCustomFields[category as keyof typeof mockCustomFields] = data[category];
      return data as unknown as T;
    }

    // Implement actual API call logic here
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // PUT request
  async put<T>(url: string, data: any, options?: ApiOptions): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // DELETE request
  async delete<T>(url: string, options?: ApiOptions): Promise<T> {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  // In a real application, this would call an API endpoint to invalidate the session
  // For now, we'll just simulate a logout by clearing local storage and redirecting
  localStorage.clear();
  
  // Redirect to home/login page
  window.location.href = "/";
};


import { api } from "@/utils/api";

export interface CustomerLookupData {
  customFields: {
    gastos_totais?: number;
    dependentes?: number;
    ultimo_uso?: number;
    tempo_de_usos?: number;
    idade?: number;
    tipo_assinatura?: string;
    tempo_contrato?: string;
    tempo_de_uso?: number;
    genero?: string;
    atrasos?: number;
    support_tickets?: number;
    id?: string;
    status_civil?: string;
    email?: string;
    [key: string]: any;
  };
  id: string;
  associations: {
    email?: string;
    id?: string;
  };
}

/**
 * Service for looking up customer information from the API
 * Follows clean architecture by focusing on a single responsibility
 */
export const customerLookupService = {
  // Lookup customer by ID
  getCustomerById: async (id: string): Promise<CustomerLookupData | null> => {
    try {
      return await api.get<CustomerLookupData>(`/customer/lookup?id=${id}`);
    } catch (error) {
      console.error("Error fetching customer by ID:", error);
      return null;
    }
  },

  // Lookup customer by email
  getCustomerByEmail: async (email: string): Promise<CustomerLookupData | null> => {
    try {
      return await api.get<CustomerLookupData>(`/customer/lookup?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Error fetching customer by email:", error);
      return null;
    }
  }
};

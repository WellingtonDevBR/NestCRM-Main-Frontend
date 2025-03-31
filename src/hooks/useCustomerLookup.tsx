
import { useState, useEffect } from "react";
import { CustomerLookupData, customerLookupService } from "@/services/customerLookupService";
import { CustomerPrediction } from "@/domain/models/prediction";

/**
 * Hook to fetch customer lookup data based on a prediction
 * @param prediction The customer prediction to get details for
 */
export function useCustomerLookup(prediction: CustomerPrediction | null) {
  const [customerData, setCustomerData] = useState<CustomerLookupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!prediction) {
      setCustomerData(null);
      return;
    }

    const fetchCustomerData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to fetch by ID first, then fall back to generating mock data
        const data = await customerLookupService.getCustomerById(prediction.customerId);
        setCustomerData(data);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch customer data"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [prediction]);

  return { customerData, isLoading, error };
}

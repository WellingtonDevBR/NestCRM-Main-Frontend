
import { useEffect, useState } from "react";
import { useCustomerLookup } from "./useCustomerLookup";
import { usePredictionMapping } from "./usePredictionMapping";
import { CustomerPrediction } from "@/domain/models/prediction";
import { transformCustomerData, getModelFieldValue } from "@/utils/fieldMappingUtils";

export function useFieldMappedCustomerData(prediction: CustomerPrediction | null) {
  const [mappedCustomerData, setMappedCustomerData] = useState<any>(null);
  
  // Get raw customer data
  const { customerData, isLoading: isLoadingCustomer } = useCustomerLookup(prediction);
  
  // Get field mappings
  const { mappingData, isLoading: isLoadingMappings } = usePredictionMapping();
  
  useEffect(() => {
    if (customerData && mappingData) {
      // Transform customer data using mappings
      const transformed = transformCustomerData(customerData, mappingData);
      setMappedCustomerData(transformed);
    }
  }, [customerData, mappingData]);
  
  // Helper function to get model field value
  const getFieldValue = (modelField: string) => {
    return getModelFieldValue(mappedCustomerData, modelField, mappingData);
  };
  
  return {
    mappedCustomerData,
    isLoading: isLoadingCustomer || isLoadingMappings,
    getFieldValue
  };
}

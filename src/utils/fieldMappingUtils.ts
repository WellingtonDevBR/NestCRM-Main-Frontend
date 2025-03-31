
import { PredictionMapping } from "@/domain/models/predictionMapping";

/**
 * Transform raw customer data using field mappings
 * This converts tenant-specific field names to standard model field names
 */
export const transformCustomerData = (
  customerData: any, 
  mappings: PredictionMapping | null
): Record<string, any> => {
  if (!customerData || !mappings || !mappings.mappings || !customerData.customFields) {
    return customerData || {};
  }

  // Create the reverse mapping (tenantField -> modelField)
  const reverseMapping: Record<string, string> = {};
  mappings.mappings.forEach(mapping => {
    if (mapping.tenantField && mapping.modelField) {
      reverseMapping[mapping.tenantField] = mapping.modelField;
    }
  });
  
  // Create transformed data with both original and mapped fields
  const transformedData: Record<string, any> = {
    ...customerData,
    modelFields: {} // Add a new section for model fields
  };
  
  // Map each tenant field to its corresponding model field
  Object.entries(customerData.customFields).forEach(([fieldName, value]) => {
    const modelField = reverseMapping[fieldName];
    if (modelField) {
      transformedData.modelFields[modelField] = value;
    }
  });
  
  return transformedData;
};

/**
 * Get a model field value from customer data
 * This handles the translation from tenant field names to model field names
 */
export const getModelFieldValue = (
  customerData: any, 
  modelField: string, 
  mappings: PredictionMapping | null
): any => {
  if (!customerData || !mappings || !mappings.mappings) {
    return undefined;
  }
  
  // First, check if we already have transformed modelFields
  if (customerData.modelFields && customerData.modelFields[modelField] !== undefined) {
    return customerData.modelFields[modelField];
  }
  
  // If not transformed yet, find the corresponding tenant field
  const mapping = mappings.mappings.find(m => m.modelField === modelField);
  if (!mapping || !mapping.tenantField) {
    return undefined;
  }
  
  // Return the value from customFields using the tenant field name
  return customerData.customFields?.[mapping.tenantField];
};

/**
 * Format field value based on model field type
 */
export const formatModelFieldValue = (value: any, modelField: string): string => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  // Format different types of fields appropriately
  switch (modelField) {
    case 'Age':
      return typeof value === 'number' ? `${value} years` : value.toString();
    case 'Gender':
    case 'Partner':
    case 'Subscription_Type':
    case 'Contract_Length':
      return value.toString();
    case 'Tenure':
      return typeof value === 'number' ? `${value} months` : value.toString();
    case 'Usage_Frequency':
      return typeof value === 'number' ? `${value} times/month` : value.toString();
    case 'Days_Since_Last_Interaction':
      return typeof value === 'number' ? `${value} days ago` : value.toString();
    case 'Total_Spend':
      return typeof value === 'number' ? `$${value.toFixed(2)}` : value.toString();
    case 'Support_Calls':
      return typeof value === 'number' ? `${value} calls` : value.toString();
    case 'Payment_Delay':
      return typeof value === 'number' ? `${value} days` : value.toString();
    default:
      return value.toString();
  }
};

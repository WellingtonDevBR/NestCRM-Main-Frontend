
/**
 * Domain model for prediction field mappings
 */

// Types representing the domain entities
export interface FieldMapping {
  modelField: string;
  tenantField: string;
  modelType?: string;
  description?: string;
  category?: string; // Added category field
}

export interface PredictionMapping {
  mappings: FieldMapping[];
}

// Model features definitions
export interface ModelFeature {
  modelField: string;
  modelType?: string;
  description?: string;
}

// Lightweight model features
export const LIGHT_FEATURES: ModelFeature[] = [
  { 
    modelField: "Age", 
    modelType: "number", 
    description: "Customer age in years" 
  },
  { 
    modelField: "Gender", 
    modelType: "select", 
    description: "Customer gender (e.g., male, female, non-binary)" 
  },
  { 
    modelField: "Partner", 
    modelType: "select", 
    description: "Whether customer has a partner or spouse" 
  },
  { 
    modelField: "Tenure", 
    modelType: "number", 
    description: "Number of months the customer has been with the company" 
  },
  { 
    modelField: "Usage_Frequency", 
    modelType: "number", 
    description: "How often the customer uses the service (e.g., logins per month)" 
  },
  { 
    modelField: "Days_Since_Last_Interaction", 
    modelType: "number", 
    description: "Number of days since the customer's last interaction with the company" 
  }
];

// Full model features 
export const FULL_FEATURES: ModelFeature[] = [
  ...LIGHT_FEATURES,
  { 
    modelField: "Dependents", 
    modelType: "number", 
    description: "Whether customer has dependents (e.g., children, elderly parents)" 
  },
  { 
    modelField: "Total_Spend", 
    modelType: "number", 
    description: "Total amount spent by the customer (e.g., lifetime value or annual spend)" 
  },
  { 
    modelField: "Support_Calls", 
    modelType: "number", 
    description: "Number of support calls made by the customer in the last 6 months" 
  },
  { 
    modelField: "Payment_Delay", 
    modelType: "number", 
    description: "Average payment delay in days (higher values indicate payment issues)" 
  },
  { 
    modelField: "Subscription_Type", 
    modelType: "select", 
    description: "Type of subscription or plan the customer is enrolled in" 
  },
  { 
    modelField: "Contract_Length", 
    modelType: "select", 
    description: "Length of customer contract (e.g., month-to-month, one year, two year)" 
  }
];

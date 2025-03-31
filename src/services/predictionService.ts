
import { CustomerPrediction, PredictionModel } from "@/domain/models/prediction";
import { api } from "@/utils/api";

// Mock prediction models
const mockPredictionModels: PredictionModel[] = [
  {
    id: "model-1",
    name: "Basic Churn Model Predictor V1",
    description: "Basic model using customer activity and payment patterns",
    accuracy: 0.74,
    lastTrained: new Date().toISOString(),
    status: "active"
  },
  {
    id: "model-2",
    name: "Advanced Churn Model Predictor",
    description: "Enhanced model using ML algorithms with support interaction analysis",
    accuracy: 0.95,
    lastTrained: new Date().toISOString(),
    status: "active"
  }
];

// API function to fetch customer predictions
const fetchCustomerPredictions = async (): Promise<CustomerPrediction[]> => {
  try {
    const response = await api.get<any[]>('/ai/predict');
    
    // Transform API response to match our domain model
    return response.map(item => ({
      id: item.id || `pred-${Math.random().toString(36).substr(2, 9)}`,
      customerId: item.customer_id,
      customerName: item.customer_name || `Customer ${item.customer_id}`, // Use provided name or generate one
      churnProbability: item.churn_probability / 100, // Convert percentage to decimal
      predictionDate: item.latest_prediction_at,
      modelId: "model-1", // Default to first model
      modelName: "Basic Churn Model Predictor V1",
      factorsContributing: (item.key_factors || []).map(factor => ({
        factor: factor.feature,
        impact: factor.contribution / 100 // Convert percentage to decimal
      }))
    }));
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return mockCustomerPredictions; // Fallback to mock data if API fails
  }
};

// Mock customer predictions (fallback data)
const mockCustomerPredictions: CustomerPrediction[] = [
  {
    id: "pred-1",
    customerId: "cust-1",
    customerName: "Acme Corporation",
    churnProbability: 0.82,
    predictionDate: "2023-09-10T08:30:00Z",
    modelId: "model-1",
    modelName: "Churn Predictor v1",
    factorsContributing: [
      { factor: "Decreased Usage", impact: 0.45 },
      { factor: "Support Tickets", impact: 0.30 },
      { factor: "Payment Delays", impact: 0.25 }
    ]
  },
  {
    id: "pred-2",
    customerId: "cust-2",
    customerName: "TechStart Inc",
    churnProbability: 0.67,
    predictionDate: "2023-09-10T09:15:00Z",
    modelId: "model-1",
    modelName: "Churn Predictor v1",
    factorsContributing: [
      { factor: "Feature Adoption", impact: 0.50 },
      { factor: "Competitor Activity", impact: 0.30 },
      { factor: "Price Sensitivity", impact: 0.20 }
    ]
  },
  {
    id: "pred-3",
    customerId: "cust-3",
    customerName: "Global Services Ltd",
    churnProbability: 0.23,
    predictionDate: "2023-09-10T10:00:00Z",
    modelId: "model-2",
    modelName: "Advanced Churn Model",
    factorsContributing: [
      { factor: "Increased Usage", impact: 0.60 },
      { factor: "Team Expansion", impact: 0.25 },
      { factor: "Feature Requests", impact: 0.15 }
    ]
  },
  {
    id: "pred-4",
    customerId: "cust-4",
    customerName: "Data Systems Corp",
    churnProbability: 0.45,
    predictionDate: "2023-09-10T11:30:00Z",
    modelId: "model-1",
    modelName: "Churn Predictor v1",
    factorsContributing: [
      { factor: "Support Satisfaction", impact: 0.40 },
      { factor: "Usage Decline", impact: 0.35 },
      { factor: "Missed Meetings", impact: 0.25 }
    ]
  },
  {
    id: "pred-5",
    customerId: "cust-5",
    customerName: "InnovateTech",
    churnProbability: 0.15,
    predictionDate: "2023-09-10T12:45:00Z",
    modelId: "model-2",
    modelName: "Advanced Churn Model",
    factorsContributing: [
      { factor: "Feature Adoption", impact: 0.55 },
      { factor: "Active Support", impact: 0.25 },
      { factor: "Team Growth", impact: 0.20 }
    ]
  },
  {
    id: "pred-6",
    customerId: "cust-6",
    customerName: "Nexus Solutions",
    churnProbability: 0.78,
    predictionDate: "2023-09-10T14:15:00Z",
    modelId: "model-1",
    modelName: "Churn Predictor v1",
    factorsContributing: [
      { factor: "Competitor Switch", impact: 0.50 },
      { factor: "Price Concerns", impact: 0.30 },
      { factor: "Feature Gaps", impact: 0.20 }
    ]
  }
];

export const predictionService = {
  // Get prediction models
  getPredictionModels: async (): Promise<PredictionModel[]> => {
    // This would be replaced with an actual API call
    return mockPredictionModels;
  },

  // Get customer predictions - now calls the API
  getCustomerPredictions: fetchCustomerPredictions,

  // Get prediction by ID
  getPredictionById: async (id: string): Promise<CustomerPrediction | undefined> => {
    const predictions = await fetchCustomerPredictions();
    return predictions.find(pred => pred.id === id);
  },

  // Get predictions by customer ID
  getPredictionsByCustomerId: async (customerId: string): Promise<CustomerPrediction[]> => {
    const predictions = await fetchCustomerPredictions();
    return predictions.filter(pred => pred.customerId === customerId);
  }
};

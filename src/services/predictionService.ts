
import { CustomerPrediction, PredictionModel } from "@/domain/models/prediction";

// Mock prediction models
const mockPredictionModels: PredictionModel[] = [
  {
    id: "model-1",
    name: "Churn Predictor v1",
    description: "Basic model using customer activity and payment patterns",
    accuracy: 0.87,
    lastTrained: "2023-08-15T14:23:45Z",
    status: "active"
  },
  {
    id: "model-2",
    name: "Advanced Churn Model",
    description: "Enhanced model using ML algorithms with support interaction analysis",
    accuracy: 0.92,
    lastTrained: "2023-09-05T11:30:22Z",
    status: "active"
  },
  {
    id: "model-3",
    name: "Behavioral Analysis Model",
    description: "Experimental model focusing on user engagement patterns",
    accuracy: 0.76,
    lastTrained: "2023-07-28T09:45:11Z",
    status: "training"
  }
];

// Mock customer predictions
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

  // Get customer predictions
  getCustomerPredictions: async (): Promise<CustomerPrediction[]> => {
    // This would be replaced with an actual API call
    return mockCustomerPredictions;
  },

  // Get prediction by ID
  getPredictionById: async (id: string): Promise<CustomerPrediction | undefined> => {
    // This would be replaced with an actual API call
    return mockCustomerPredictions.find(pred => pred.id === id);
  },

  // Get predictions by customer ID
  getPredictionsByCustomerId: async (customerId: string): Promise<CustomerPrediction[]> => {
    // This would be replaced with an actual API call
    return mockCustomerPredictions.filter(pred => pred.customerId === customerId);
  }
};

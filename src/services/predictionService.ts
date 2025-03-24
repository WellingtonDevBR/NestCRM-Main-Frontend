
import { CustomerPrediction, PredictionModel } from "@/domain/models/prediction";

// Mock data for prediction models
const mockPredictionModels: PredictionModel[] = [
  {
    id: "model-001",
    name: "Churn Predictor v1",
    description: "Basic churn prediction model based on customer activity patterns",
    accuracy: 0.78,
    lastTrained: "2023-10-15T12:00:00Z",
    status: "active"
  },
  {
    id: "model-002",
    name: "Advanced Churn Predictor",
    description: "Enhanced model with customer support and payment history features",
    accuracy: 0.86,
    lastTrained: "2024-01-10T09:30:00Z",
    status: "active"
  },
  {
    id: "model-003",
    name: "Experimental NLP Model",
    description: "Uses customer communication sentiment analysis for predictions",
    accuracy: 0.72,
    lastTrained: "2024-02-28T15:45:00Z",
    status: "training"
  }
];

// Mock data for customer predictions
const mockCustomerPredictions: CustomerPrediction[] = [
  {
    id: "pred-001",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    churnProbability: 0.15,
    predictionDate: "2024-03-01T10:30:00Z",
    modelId: "model-002",
    modelName: "Advanced Churn Predictor",
    factorsContributing: [
      { factor: "Recent support tickets", impact: 0.25 },
      { factor: "Decreased usage", impact: 0.35 },
      { factor: "Contract renewal approaching", impact: 0.40 }
    ]
  },
  {
    id: "pred-002",
    customerId: "cust-002",
    customerName: "Bob Smith",
    churnProbability: 0.65,
    predictionDate: "2024-03-02T14:15:00Z",
    modelId: "model-002",
    modelName: "Advanced Churn Predictor",
    factorsContributing: [
      { factor: "Pricing concerns (support tickets)", impact: 0.50 },
      { factor: "Competitor outreach", impact: 0.30 },
      { factor: "Feature usage decline", impact: 0.20 }
    ]
  },
  {
    id: "pred-003",
    customerId: "cust-003",
    customerName: "Carol Davis",
    churnProbability: 0.35,
    predictionDate: "2024-03-03T09:45:00Z",
    modelId: "model-002",
    modelName: "Advanced Churn Predictor",
    factorsContributing: [
      { factor: "Product fit issues", impact: 0.45 },
      { factor: "Support response times", impact: 0.35 },
      { factor: "Industry volatility", impact: 0.20 }
    ]
  },
  {
    id: "pred-004",
    customerId: "cust-004",
    customerName: "David Wilson",
    churnProbability: 0.82,
    predictionDate: "2024-03-04T16:00:00Z",
    modelId: "model-002",
    modelName: "Advanced Churn Predictor",
    factorsContributing: [
      { factor: "Payment issues", impact: 0.60 },
      { factor: "Decreased logins", impact: 0.25 },
      { factor: "Feature requests unfulfilled", impact: 0.15 }
    ]
  },
  {
    id: "pred-005",
    customerId: "cust-005",
    customerName: "Eve Brown",
    churnProbability: 0.08,
    predictionDate: "2024-03-05T11:30:00Z",
    modelId: "model-002",
    modelName: "Advanced Churn Predictor",
    factorsContributing: [
      { factor: "Recent upgrade", impact: 0.50 },
      { factor: "Positive feedback", impact: 0.30 },
      { factor: "Increased usage", impact: 0.20 }
    ]
  }
];

export const predictionService = {
  // Get prediction models
  getPredictionModels: async (): Promise<PredictionModel[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPredictionModels), 800);
    });
  },

  // Get customer predictions
  getCustomerPredictions: async (): Promise<CustomerPrediction[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCustomerPredictions), 800);
    });
  },

  // Get prediction by ID
  getPredictionById: async (id: string): Promise<CustomerPrediction | undefined> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const prediction = mockCustomerPredictions.find(pred => pred.id === id);
        resolve(prediction);
      }, 500);
    });
  },

  // Get predictions by customer ID
  getPredictionsByCustomerId: async (customerId: string): Promise<CustomerPrediction[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const predictions = mockCustomerPredictions.filter(pred => pred.customerId === customerId);
        resolve(predictions);
      }, 500);
    });
  }
};

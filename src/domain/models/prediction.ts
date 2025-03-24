
// Prediction domain models
export interface PredictionModel {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'inactive';
}

export interface CustomerPrediction {
  id: string;
  customerId: string;
  customerName: string;
  churnProbability: number;
  predictionDate: string;
  modelId: string;
  modelName: string;
  factorsContributing: {
    factor: string;
    impact: number;
  }[];
}

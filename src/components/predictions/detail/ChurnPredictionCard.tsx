
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CustomerPrediction } from "@/domain/models/prediction";
import { formatDate } from "../detailUtils";

interface ChurnPredictionCardProps {
  prediction: CustomerPrediction;
}

const ChurnPredictionCard: React.FC<ChurnPredictionCardProps> = ({ prediction }) => {
  const percentage = Math.round(prediction.churnProbability * 100);
  
  // Determine risk level color and label
  const getRiskLevel = () => {
    if (percentage >= 70) return { label: "High Risk", color: "bg-red-100 text-red-800 hover:bg-red-200" };
    if (percentage >= 40) return { label: "Medium Risk", color: "bg-amber-100 text-amber-800 hover:bg-amber-200" };
    return { label: "Low Risk", color: "bg-green-100 text-green-800 hover:bg-green-200" };
  };
  
  const riskInfo = getRiskLevel();
  
  // Get progress bar color
  const getProgressColorClass = () => {
    if (percentage >= 70) return "bg-red-600";
    if (percentage >= 40) return "bg-amber-600";
    return "bg-green-600";
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-2">Churn Prediction</h3>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          Prediction Date: {formatDate(prediction.predictionDate)}
        </span>
        <Badge className={riskInfo.color}>{riskInfo.label}</Badge>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span>Churn Probability</span>
          <span className="font-bold">{percentage}%</span>
        </div>
        <Progress 
          value={percentage} 
          className={`h-2 bg-secondary ${getProgressColorClass()} [&>div]:${getProgressColorClass()}`}
        />
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Prediction Model</h4>
        <div className="text-sm text-muted-foreground">
          <div>Model: {prediction.modelName}</div>
          <div>Model ID: {prediction.modelId}</div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPredictionCard;

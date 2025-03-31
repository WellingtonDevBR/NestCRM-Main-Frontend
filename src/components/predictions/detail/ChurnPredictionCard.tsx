
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CustomerPrediction } from "@/domain/models/prediction";
import { formatDate } from "../detailUtils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface ChurnPredictionCardProps {
  prediction: CustomerPrediction;
}

const ChurnPredictionCard: React.FC<ChurnPredictionCardProps> = ({ prediction }) => {
  const percentage = Math.round(prediction.churnProbability * 100);
  
  // Determine risk level styling and icon
  const getRiskLevel = () => {
    if (percentage >= 70) {
      return { 
        label: "High Risk", 
        color: "bg-red-100 text-red-800 border-red-300",
        hoverColor: "hover:bg-red-200",
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      };
    }
    if (percentage >= 40) {
      return { 
        label: "Medium Risk", 
        color: "bg-amber-100 text-amber-800 border-amber-300",
        hoverColor: "hover:bg-amber-200",
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
      };
    }
    return { 
      label: "Low Risk", 
      color: "bg-green-100 text-green-800 border-green-300",
      hoverColor: "hover:bg-green-200",
      icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />
    };
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
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${riskInfo.color} ${riskInfo.hoverColor} border`}>
          {riskInfo.icon}
          {riskInfo.label}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span>Churn Probability</span>
          <span className="font-bold">{percentage}%</span>
        </div>
        <Progress 
          value={percentage} 
          className={`h-2 ${getProgressColorClass()}`}
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

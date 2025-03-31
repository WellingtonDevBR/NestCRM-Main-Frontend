
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CustomerPrediction } from "@/domain/models/prediction";
import { formatDate } from "../detailUtils";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        variant: "destructive" as const,
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />
      };
    }
    if (percentage >= 40) {
      return { 
        label: "Medium Risk", 
        variant: "warning" as const,
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
      };
    }
    return { 
      label: "Low Risk", 
      variant: "success" as const,
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
    <div className="rounded-lg border bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <h3 className="font-semibold text-lg mb-3 text-card-foreground">Churn Prediction</h3>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm text-muted-foreground">
          Prediction Date: {formatDate(prediction.predictionDate)}
        </span>
        <Badge variant={riskInfo.variant} className="flex items-center font-medium">
          {riskInfo.icon}
          {riskInfo.label}
        </Badge>
      </div>
      
      <div className="mt-5 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Churn Probability</span>
          <span className="font-bold text-base">{percentage}%</span>
        </div>
        <Progress 
          value={percentage} 
          className={`h-2.5 ${getProgressColorClass()}`}
        />
      </div>
      
      <div className="mt-5 pt-3 border-t">
        <h4 className="text-sm font-medium mb-2 text-card-foreground">Prediction Model</h4>
        <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
          <div>Model:</div><div className="font-medium text-foreground">{prediction.modelName}</div>
          <div>Model ID:</div><div className="font-medium text-foreground">{prediction.modelId}</div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPredictionCard;

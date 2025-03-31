
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
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />,
        bgClass: "bg-red-50 dark:bg-red-900/20",
        borderClass: "border-red-200 dark:border-red-800/30",
        textClass: "text-red-700 dark:text-red-300"
      };
    }
    if (percentage >= 40) {
      return { 
        label: "Medium Risk", 
        variant: "warning" as const,
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
        bgClass: "bg-amber-50 dark:bg-amber-900/20",
        borderClass: "border-amber-200 dark:border-amber-800/30",
        textClass: "text-amber-700 dark:text-amber-300"
      };
    }
    return { 
      label: "Low Risk", 
      variant: "success" as const,
      icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
      bgClass: "bg-green-50 dark:bg-green-900/20",
      borderClass: "border-green-200 dark:border-green-800/30",
      textClass: "text-green-700 dark:text-green-300"
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
        
        {/* Updated Badge with better design */}
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${riskInfo.bgClass} ${riskInfo.borderClass} ${riskInfo.textClass} border`}>
          {riskInfo.icon}
          {riskInfo.label}
        </div>
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

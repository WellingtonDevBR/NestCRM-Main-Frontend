
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PredictionScoreCardProps {
  probability: number;
  customerName: string;
  factorsContributing: {
    factor: string;
    impact: number;
  }[];
  onClick?: () => void;
}

const PredictionScoreCard: React.FC<PredictionScoreCardProps> = ({ 
  probability, 
  customerName, 
  factorsContributing,
  onClick
}) => {
  // Format probability as percentage
  const percentage = Math.round(probability * 100);
  
  // Determine risk level color
  const getColorClass = () => {
    if (percentage >= 70) return "text-red-600";
    if (percentage >= 40) return "text-amber-600";
    return "text-green-600";
  };
  
  // Determine progress bar color
  const getProgressColorClass = () => {
    if (percentage >= 70) return "bg-red-600";
    if (percentage >= 40) return "bg-amber-600";
    return "bg-green-600";
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-3">
        <div className="flex justify-between items-start">
          <h4 className="font-medium">{customerName}</h4>
          <span className={`text-xl font-bold ${getColorClass()}`}>
            {percentage}%
          </span>
        </div>
        <div className="mt-2">
          <Progress 
            value={percentage} 
            className={`h-2 bg-secondary ${getProgressColorClass()} [&>div]:${getProgressColorClass()}`}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <h5 className="text-sm font-medium text-muted-foreground mb-2">Key Factors:</h5>
        <ul className="space-y-1">
          {factorsContributing.length > 0 ? (
            factorsContributing.map((factor, index) => (
              <li key={index} className="text-sm flex justify-between">
                <span>{factor.factor}</span>
                <span className="text-muted-foreground">
                  {Math.round(factor.impact * 100)}%
                </span>
              </li>
            ))
          ) : (
            <li className="text-sm text-muted-foreground">No factors available</li>
          )}
        </ul>
      </div>
    </Card>
  );
};

export default PredictionScoreCard;

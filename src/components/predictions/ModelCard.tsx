
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionModel } from "@/domain/models/prediction";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid } from "date-fns";

interface ModelCardProps {
  model: PredictionModel;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  // Format accuracy as percentage
  const accuracyPercentage = Math.round(model.accuracy * 100);
  
  // Determine status badge color
  const getStatusBadgeClass = () => {
    switch (model.status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "training":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "";
    }
  };

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{model.name}</CardTitle>
          <Badge variant="outline" className={getStatusBadgeClass()}>
            {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm mb-4">{model.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-muted-foreground">Accuracy</span>
            <div className="text-lg font-medium">{accuracyPercentage}%</div>
          </div>
          <div className="text-right">
            <span className="text-sm text-muted-foreground">Last Trained</span>
            <div className="text-sm">
              {formatDate(model.lastTrained)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full">
          <button 
            className="w-full text-sm text-purple-600 hover:text-purple-800 transition-colors"
          >
            View Details
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;

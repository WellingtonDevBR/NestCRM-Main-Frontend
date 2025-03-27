
import React from "react";
import { TrendingUp } from "lucide-react";

interface PredictionMappingHeaderProps {
  title: string;
}

const PredictionMappingHeader: React.FC<PredictionMappingHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2">
      <TrendingUp className="h-6 w-6 text-purple-600" />
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
};

export default PredictionMappingHeader;

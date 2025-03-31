
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionModel } from "@/domain/models/prediction";
import ModelCard from "@/components/predictions/ModelCard";

interface ModelsSectionProps {
  models: PredictionModel[];
}

const ModelsSection: React.FC<ModelsSectionProps> = ({ models }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Models</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelsSection;


import React from "react";
import { Button } from "@/components/ui/button";

interface ModelSelectorProps {
  activeModel: "lightweight" | "full";
  setActiveModel: (model: "lightweight" | "full") => void;
  lightFeaturesCount: number;
  fullFeaturesCount: number;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  activeModel,
  setActiveModel,
  lightFeaturesCount,
  fullFeaturesCount
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <Button
        onClick={() => setActiveModel("lightweight")}
        variant={activeModel === "lightweight" ? "default" : "outline"}
        className={activeModel === "lightweight" ? "bg-purple-600 hover:bg-purple-700 text-white" : "dark:text-gray-300 dark:border-gray-600"}
        size="sm"
      >
        Lightweight Model ({lightFeaturesCount} fields)
      </Button>
      <Button
        onClick={() => setActiveModel("full")}
        variant={activeModel === "full" ? "default" : "outline"}
        className={activeModel === "full" ? "bg-purple-600 hover:bg-purple-700 text-white" : "dark:text-gray-300 dark:border-gray-600"}
        size="sm"
      >
        Full Model ({fullFeaturesCount} fields)
      </Button>
    </div>
  );
};

export default ModelSelector;

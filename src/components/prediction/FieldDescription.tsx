
import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FieldDescriptionProps {
  description?: string;
}

const FieldDescription: React.FC<FieldDescriptionProps> = ({ description }) => {
  if (!description) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="ml-1.5 text-gray-400 hover:text-gray-500">
            <HelpCircle size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 text-sm">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FieldDescription;

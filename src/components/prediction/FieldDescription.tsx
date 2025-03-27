
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
          <button className="ml-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
            <HelpCircle size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 text-sm dark:bg-gray-800 dark:border-gray-700">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FieldDescription;

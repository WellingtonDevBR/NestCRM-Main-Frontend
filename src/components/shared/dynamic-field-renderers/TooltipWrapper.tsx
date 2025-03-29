
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipWrapperProps } from "./types";

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ 
  content, 
  tooltip, 
  className = ""
}) => {
  if (!tooltip) {
    return <>{content}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`cursor-help ${className}`}>{content}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper;

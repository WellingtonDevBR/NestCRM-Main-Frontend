
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LucideIcon, MoreHorizontal } from "lucide-react";

export interface ActionItem {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  condition?: boolean;
}

interface EntityActionsProps {
  actions: ActionItem[];
}

const EntityActions: React.FC<EntityActionsProps> = ({ actions }) => {
  // Filter out actions that have a condition set to false
  const visibleActions = actions.filter(action => 
    action.condition === undefined || action.condition === true
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleActions.map((action, index) => (
          <DropdownMenuItem 
            key={index}
            onClick={action.onClick}
            className={action.className}
          >
            {React.createElement(action.icon, { className: "mr-2 h-4 w-4" })}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EntityActions;

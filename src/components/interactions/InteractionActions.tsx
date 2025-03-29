
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
import { Edit, MoreHorizontal, Trash, Eye, Clock, CheckCircle } from "lucide-react";
import { Interaction } from "@/domain/models/interaction";

interface InteractionActionsProps {
  interaction: Interaction;
  onView?: (interaction: Interaction) => void;
  onEdit?: (interaction: Interaction) => void;
  onFollow?: (interaction: Interaction) => void;
  onMarkAsResolved?: (interactionId: string) => void;
  onDelete?: (interactionId: string) => void;
}

const InteractionActions: React.FC<InteractionActionsProps> = ({
  interaction,
  onView,
  onEdit,
  onFollow,
  onMarkAsResolved,
  onDelete
}) => {
  const isPending = interaction.status === 'pending';
  const isOpen = interaction.status === 'open';

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
        {onView && (
          <DropdownMenuItem onClick={() => onView(interaction)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(interaction)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onFollow && (
          <DropdownMenuItem onClick={() => onFollow(interaction)}>
            <Clock className="mr-2 h-4 w-4" />
            Follow Up
          </DropdownMenuItem>
        )}
        {onMarkAsResolved && (isPending || isOpen) && (
          <DropdownMenuItem onClick={() => onMarkAsResolved(interaction.id)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Resolved
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(interaction.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InteractionActions;

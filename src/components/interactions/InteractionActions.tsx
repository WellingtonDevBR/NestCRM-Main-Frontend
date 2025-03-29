
import React from "react";
import { Interaction } from "@/domain/models/interaction";
import EntityActions, { ActionItem } from "@/components/shared/EntityActions";
import { Edit, Trash, Eye, Clock, CheckCircle } from "lucide-react";

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

  const actions: ActionItem[] = [
    {
      icon: Eye,
      label: "View Details",
      onClick: () => onView && onView(interaction),
      condition: !!onView
    },
    {
      icon: Edit,
      label: "Edit",
      onClick: () => onEdit && onEdit(interaction),
      condition: !!onEdit
    },
    {
      icon: Clock,
      label: "Follow Up",
      onClick: () => onFollow && onFollow(interaction),
      condition: !!onFollow
    },
    {
      icon: CheckCircle,
      label: "Mark as Resolved",
      onClick: () => onMarkAsResolved && onMarkAsResolved(interaction.id),
      condition: !!onMarkAsResolved && (isPending || isOpen)
    },
    {
      icon: Trash,
      label: "Delete",
      onClick: () => onDelete && onDelete(interaction.id),
      className: "text-red-600 focus:text-red-600",
      condition: !!onDelete
    }
  ];

  return <EntityActions actions={actions} />;
};

export default InteractionActions;

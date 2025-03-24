
import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'High Risk':
        return 'bg-red-100 text-red-700';
      case 'Medium Risk':
        return 'bg-amber-100 text-amber-700';
      case 'Low Risk':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

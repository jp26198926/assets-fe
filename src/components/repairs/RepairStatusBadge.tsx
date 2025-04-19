
import React from 'react';

interface RepairStatusBadgeProps {
  status: string;
}

const RepairStatusBadge: React.FC<RepairStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'Fixed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'Defective':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      case 'Deleted':
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  return (
    <span className={getStatusBadgeClass(status)}>
      {status}
    </span>
  );
};

export default RepairStatusBadge;

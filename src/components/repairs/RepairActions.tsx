
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";

interface RepairActionsProps {
  repair: any;
  onViewDetails: (repair: any) => void;
  onCompleteRepair: (repair: any) => void;
  onMarkDefective: (repair: any) => void;
  onDeleteRepair: (repair: any) => void;
}

const RepairActions: React.FC<RepairActionsProps> = ({
  repair,
  onViewDetails,
  onCompleteRepair,
  onMarkDefective,
  onDeleteRepair,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(repair)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        {repair.status === 'Ongoing' && (
          <>
            <DropdownMenuItem onClick={() => onCompleteRepair(repair)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Fixed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onMarkDefective(repair)} className="text-yellow-600">
              <XCircle className="mr-2 h-4 w-4" />
              Mark as Defective
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => onDeleteRepair(repair)} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RepairActions;

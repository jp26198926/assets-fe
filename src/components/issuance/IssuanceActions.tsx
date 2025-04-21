
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";

interface IssuanceActionsProps {
  onNewIssuance: () => void;
}

const IssuanceActions: React.FC<IssuanceActionsProps> = ({ onNewIssuance }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={onNewIssuance} aria-label="New Issuance">
            <Plus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          New Issuance
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IssuanceActions;

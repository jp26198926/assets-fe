
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface IssuanceActionsProps {
  onNewIssuance: () => void;
}

const IssuanceActions: React.FC<IssuanceActionsProps> = ({ onNewIssuance }) => {
  return (
    <Button onClick={onNewIssuance}>
      <Plus className="mr-2 h-4 w-4" /> New Issuance
    </Button>
  );
};

export default IssuanceActions;

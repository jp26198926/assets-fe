
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Trail } from '@/hooks/useTrailsApi';

interface TrailDetailsDialogProps {
  trail: Trail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TrailDetailsDialog: React.FC<TrailDetailsDialogProps> = ({
  trail,
  open,
  onOpenChange,
}) => {
  if (!trail) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Trail Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm">Timestamp</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(trail.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">User</h3>
              <p className="text-sm text-muted-foreground">
                {trail.userId ? `${trail.userId.firstname} ${trail.userId.lastname}` : 'System'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">IP Address</h3>
              <p className="text-sm text-muted-foreground">{trail.ip}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Action</h3>
              <p className="text-sm text-muted-foreground">{trail.action}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Entity</h3>
              <p className="text-sm text-muted-foreground">{trail.entity}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm">Details</h3>
            <pre className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-2 rounded-md">
              {trail.details}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrailDetailsDialog;

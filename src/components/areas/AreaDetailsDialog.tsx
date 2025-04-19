
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Area } from '@/hooks/useAreasApi';

interface AreaDetailsDialogProps {
  area: Area | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AreaDetailsDialog: React.FC<AreaDetailsDialogProps> = ({
  area,
  open,
  onOpenChange,
}) => {
  if (!area) return null;

  const formatName = (user?: { firstname: string; lastname: string }) => {
    return user ? `${user.firstname} ${user.lastname}` : '-';
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return '-';
      }
      return format(dateObj, 'PPP p');
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return '-';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Area Details</DialogTitle>
          <DialogDescription>
            Detailed information about the area record
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Area</h3>
              <p className="text-sm text-muted-foreground">{area.area}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Status</h3>
              <p className="text-sm text-muted-foreground">{area.status}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Record Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">{formatName(area.createdBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(area.createdAt)}</p>
              </div>
              {area.updatedBy && (
                <div>
                  <p className="text-sm font-medium">Updated By</p>
                  <p className="text-sm text-muted-foreground">{formatName(area.updatedBy)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(area.updatedAt)}</p>
                </div>
              )}
            </div>
            {area.deletedBy && (
              <div className="mt-4">
                <p className="text-sm font-medium">Deleted By</p>
                <p className="text-sm text-muted-foreground">{formatName(area.deletedBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(area.deletedAt)}</p>
                {area.deletedReason && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Deletion Reason</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {area.deletedReason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AreaDetailsDialog;

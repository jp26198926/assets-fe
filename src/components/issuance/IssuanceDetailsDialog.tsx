
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Issuance } from '@/hooks/useIssuanceApi';

interface IssuanceDetailsDialogProps {
  issuance: Issuance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const IssuanceDetailsDialog: React.FC<IssuanceDetailsDialogProps> = ({
  issuance,
  open,
  onOpenChange,
}) => {
  if (!issuance) return null;

  const formatName = (user?: { firstname: string; lastname: string }) => {
    return user ? `${user.firstname} ${user.lastname}` : '-';
  };

  const formatDate = (date?: string) => {
    // Add validation to ensure the date is valid before formatting
    if (!date) return '-';
    
    try {
      const dateObj = new Date(date);
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return '-';
      }
      return format(dateObj, 'PPP p'); // Format both date and time
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return '-';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Issuance Details</DialogTitle>
          <DialogDescription>
            Detailed information about the issuance record
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm">Date</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(issuance.date)}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Status</h3>
              <p className="text-sm text-muted-foreground">{issuance.status}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Assigned By</h3>
              <p className="text-sm text-muted-foreground">
                {formatName(issuance.assignedBy)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Item</h3>
              <p className="text-sm text-muted-foreground">
                {issuance.itemId?.itemName || '-'} ({issuance.itemId?.barcodeId || '-'})
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Type</h3>
              <p className="text-sm text-muted-foreground">
                {issuance.itemId?.typeId?.type || '-'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm">Area</h3>
            <p className="text-sm text-muted-foreground">
              {issuance.roomId?.area || '-'}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm">Remarks</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {issuance.remarks || '-'}
            </p>
          </div>

          {issuance.signature && (
            <div>
              <h3 className="font-medium text-sm">Signature</h3>
              <img src={issuance.signature} alt="Signature" className="max-h-32 mt-1 border rounded" />
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Record Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">{formatName(issuance.createdBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(issuance.createdAt)}</p>
              </div>
              {issuance.updatedBy && (
                <div>
                  <p className="text-sm font-medium">Updated By</p>
                  <p className="text-sm text-muted-foreground">{formatName(issuance.updatedBy)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(issuance.updatedAt)}</p>
                </div>
              )}
            </div>
            {issuance.deletedBy && (
              <div className="mt-4">
                <p className="text-sm font-medium">Deleted By</p>
                <p className="text-sm text-muted-foreground">{formatName(issuance.deletedBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(issuance.deletedAt)}</p>
                {issuance.deletedReason && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Deletion Reason</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {issuance.deletedReason}
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

export default IssuanceDetailsDialog;

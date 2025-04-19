
import React, { useEffect } from 'react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Repair } from '@/hooks/useRepairsApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface RepairDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repair: Repair | null;
}

const RepairDetailsDialog: React.FC<RepairDetailsDialogProps> = ({
  open,
  onOpenChange,
  repair,
}) => {
  // Format date helper function
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // This function helps display user names safely
  const formatUserName = (user: any) => {
    if (!user) return 'Unknown';
    return `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown';
  };

  // Cleanup function to ensure body styles are reset
  const handleCloseDialog = () => {
    // Reset any body styles that might be preventing interaction
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    
    // Call the parent's onOpenChange
    onOpenChange(false);
  };

  // Clean up on unmount and dialog close
  useEffect(() => {
    // Reset styles when dialog opens or closes
    if (!open) {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    }
    
    // Cleanup function when component unmounts
    return () => {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent 
        className="max-w-md max-h-[80vh]"
        forceMount
        onEscapeKeyDown={handleCloseDialog}
        onInteractOutside={handleCloseDialog}
        onPointerDownOutside={handleCloseDialog}
        aria-describedby="repair-details-description"
      >
        <DialogHeader>
          <DialogTitle>Repair Details</DialogTitle>
          <DialogDescription id="repair-details-description">
            Detailed information about the repair record
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full">
          {repair && (
            <div className="space-y-4 p-1">
              <div>
                <h3 className="font-semibold mb-1">Date</h3>
                <p className="text-sm text-muted-foreground">
                  {repair.date ? format(new Date(repair.date), 'PPP') : '-'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Item</h3>
                <p className="text-sm text-muted-foreground">
                  {repair.itemId?.itemName || 'Unknown Item'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Type: {repair.itemId?.typeId?.type || 'N/A'}
                </p>
                {repair.itemId?.barcodeId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Barcode ID: {repair.itemId.barcodeId}
                  </p>
                )}
                {repair.itemId?.serialNo && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Serial No: {repair.itemId.serialNo}
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-1">Problem</h3>
                <p className="text-sm text-muted-foreground">{repair.problem}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Status</h3>
                <p className="text-sm text-muted-foreground">{repair.status}</p>
              </div>

              {repair.diagnosis && (
                <div>
                  <h3 className="font-semibold mb-1">Diagnosis</h3>
                  <p className="text-sm text-muted-foreground">{repair.diagnosis}</p>
                </div>
              )}

              <div className="pt-2">
                <h3 className="font-semibold mb-2">Record Information</h3>
                
                <div className="space-y-2">
                  {repair.createdAt && (
                    <div>
                      <span className="text-sm font-medium">Created:</span>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(repair.createdAt)} by {formatUserName(repair.createdBy)}
                      </p>
                    </div>
                  )}

                  {repair.updatedAt && (
                    <div>
                      <span className="text-sm font-medium">Updated:</span>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(repair.updatedAt)} by {formatUserName(repair.updatedBy)}
                      </p>
                    </div>
                  )}

                  {repair.deletedAt && (
                    <div>
                      <span className="text-sm font-medium">Deleted:</span>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(repair.deletedAt)} by {formatUserName(repair.deletedBy)}
                      </p>
                      {repair.deletedReason && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Reason: {repair.deletedReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-end mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepairDetailsDialog;

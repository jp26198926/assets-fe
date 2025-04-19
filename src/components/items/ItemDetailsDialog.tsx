import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Item } from '@/hooks/useItemsApi';

interface ItemDetailsDialogProps {
  item: Item | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ItemDetailsDialog: React.FC<ItemDetailsDialogProps> = ({
  item,
  open,
  onOpenChange,
}) => {
  if (!item) return null;

  const formatName = (user?: { firstname?: string; lastname?: string } | null) => {
    if (!user || (!user.firstname && !user.lastname)) return 'Not specified';
    return `${user.firstname || ''} ${user.lastname || ''}`.trim();
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
          <DialogTitle>Item Details</DialogTitle>
          <DialogDescription>
            Detailed information about the item record
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {item.photo && (
            <div className="flex justify-center">
              <img 
                src={item.photo} 
                alt={item.itemName} 
                className="max-h-[200px] object-contain rounded-md"
              />
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm">Item Name</h3>
              <p className="text-sm text-muted-foreground">{item.itemName}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Serial No</h3>
              <p className="text-sm text-muted-foreground">{item.serialNo}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Barcode ID</h3>
              <p className="text-sm text-muted-foreground">{item.barcodeId}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm">Type</h3>
              <p className="text-sm text-muted-foreground">
                {typeof item.typeId === 'object' ? item.typeId.type : 'Unknown'}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Brand</h3>
              <p className="text-sm text-muted-foreground">{item.brand}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Status</h3>
              <p className="text-sm text-muted-foreground">{item.status}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Record Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">{formatName(item.createdBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(item.createdAt)}</p>
              </div>
              {item.updatedBy && (
                <div>
                  <p className="text-sm font-medium">Updated By</p>
                  <p className="text-sm text-muted-foreground">{formatName(item.updatedBy)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.updatedAt)}</p>
                </div>
              )}
            </div>
            {item.deletedBy && (
              <div className="mt-4">
                <p className="text-sm font-medium">Deleted By</p>
                <p className="text-sm text-muted-foreground">{formatName(item.deletedBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(item.deletedAt)}</p>
                {item.deletedReason && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Deletion Reason</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {item.deletedReason}
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

export default ItemDetailsDialog;

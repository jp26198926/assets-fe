
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { ItemType } from '@/hooks/useItemTypesApi';

interface ItemTypeDetailsDialogProps {
  itemType: ItemType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ItemTypeDetailsDialog: React.FC<ItemTypeDetailsDialogProps> = ({
  itemType,
  open,
  onOpenChange,
}) => {
  if (!itemType) return null;

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
          <DialogTitle>Item Type Details</DialogTitle>
          <DialogDescription>
            Detailed information about the item type record
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Type Name</h3>
              <p className="text-sm text-muted-foreground">{itemType.type}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Status</h3>
              <p className="text-sm text-muted-foreground">{itemType.status}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Record Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">{formatName(itemType.createdBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(itemType.createdAt)}</p>
              </div>
              {itemType.updatedBy && (
                <div>
                  <p className="text-sm font-medium">Updated By</p>
                  <p className="text-sm text-muted-foreground">{formatName(itemType.updatedBy)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(itemType.updatedAt)}</p>
                </div>
              )}
            </div>
            {itemType.deletedBy && (
              <div className="mt-4">
                <p className="text-sm font-medium">Deleted By</p>
                <p className="text-sm text-muted-foreground">{formatName(itemType.deletedBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(itemType.deletedAt)}</p>
                {itemType.deletedReason && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Deletion Reason</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {itemType.deletedReason}
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

export default ItemTypeDetailsDialog;

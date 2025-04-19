
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { User } from '@/hooks/useUsersApi';

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  user,
  open,
  onOpenChange,
}) => {
  if (!user) return null;

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
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Detailed information about the user record
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-sm">Name</h3>
              <p className="text-sm text-muted-foreground">
                {user.firstname} {user.lastname}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Email</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm">Role</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Status</h3>
              <p className="text-sm text-muted-foreground">{user.status}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium text-sm mb-2">Record Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created By</p>
                <p className="text-sm text-muted-foreground">{formatName(user.createdBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
              </div>
              {user.updatedBy && (
                <div>
                  <p className="text-sm font-medium">Updated By</p>
                  <p className="text-sm text-muted-foreground">{formatName(user.updatedBy)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.updatedAt)}</p>
                </div>
              )}
            </div>
            {user.deletedBy && (
              <div className="mt-4">
                <p className="text-sm font-medium">Deleted By</p>
                <p className="text-sm text-muted-foreground">{formatName(user.deletedBy)}</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.deletedAt)}</p>
                {user.deletedReason && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Deletion Reason</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {user.deletedReason}
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

export default UserDetailsDialog;

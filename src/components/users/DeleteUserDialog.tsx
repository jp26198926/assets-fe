
import React, { useEffect } from 'react';
import { User } from '@/hooks/useUsersApi';
import { useForm } from 'react-hook-form';
import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type DeleteFormValues = {
  reason: string;
};

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DeleteFormValues) => void;
  isDeleting: boolean;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSubmit,
  isDeleting
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DeleteFormValues>();

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Please provide a reason for deletion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Reason for deletion..."
              {...register("reason", { required: "Reason is required" })}
              className={errors.reason ? "border-red-500" : ""}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason.message}</p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={handleClose} className="bg-white">
              Cancel
            </AlertDialogCancel>
            <Button type="submit" variant="destructive" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete User
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;


import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

type DeleteFormValues = {
  reason: string;
};

interface DeleteRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DeleteFormValues) => void;
  isDeleting: boolean;
}

const DeleteRepairDialog: React.FC<DeleteRepairDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isDeleting
}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DeleteFormValues>();

  const handleDelete = (data: DeleteFormValues) => {
    onSubmit(data);
    reset();
  };
  
  // Cleanup function to ensure body styles are reset
  const handleDialogClose = () => {
    // Reset any body styles that might be preventing interaction
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    
    // Call the parent's onOpenChange
    onOpenChange(false);
  };

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      reset();
    }
    
    // Cleanup function when component unmounts
    return () => {
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    };
  }, [open, reset]);

  return (
    <AlertDialog open={open} onOpenChange={handleDialogClose}>
      <AlertDialogContent onEscapeKeyDown={handleDialogClose}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Repair Record</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Please provide a reason for deletion.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(handleDelete)}>
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
            <AlertDialogCancel onClick={() => {
              reset();
              handleDialogClose();
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button type="submit" variant="destructive" disabled={isDeleting}>
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRepairDialog;
